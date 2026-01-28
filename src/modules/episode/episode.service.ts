import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { EpisodeQueryDto } from "./dtos/episode-query.dto";
import { CreateEpisodeDto } from "./dtos/create-episode.dto";
import { UpdateEpisodeDto } from "./dtos/update-episode.dto";
import { EpisodeListResponseDto, EpisodeDetailsDto } from "./dtos/episode-response.dto";
import { EpisodeMapper } from "./episode.mapper";
import { EpisodeParser } from "./episode.parser";
import { IEpisodeRatingInfo } from "./episode.interface";
import { getCacheConfig, CACHE_TTL, shouldSkipCache } from "../../utils/cache.util";

@Injectable()
export class EpisodeService {
    constructor(private prisma: PrismaService) {}

    async findAll(query: EpisodeQueryDto, userId?: number): Promise<EpisodeListResponseDto> {
        try {
            const { filters, orderByObject, skip, take } = EpisodeParser.parseEpisodeQuery(query);

            const episodes = await this.prisma.episode.findMany({
                where: filters,
                orderBy: orderByObject,
                skip,
                take,
            });

            const episodeIds = episodes.map((episode) => episode.id);
            const ratingsInfo = await this.getEpisodeRatings(episodeIds);

            const episodesWithDetails = await Promise.all(
                episodes.map(async (episode) => {
                    const bookmarkInfo = userId
                        ? await this.getBookmarkStatus(episode.id, userId)
                        : { isBookmarked: false };
                    const reviewInfo = userId ? await this.getReviewStatus(episode.id, userId) : { isReviewed: false };
                    return EpisodeMapper.toDtoWithDetails(episode, ratingsInfo[episode.id], bookmarkInfo, reviewInfo);
                }),
            );

            const totalCount = await this.prisma.episode.count({ where: filters });

            return EpisodeMapper.toListResponseDto({ episodes: episodesWithDetails, count: totalCount });
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            if (error.code === "P2022" || error.code === "P2009") {
                throw new BadRequestException("Invalid query parameters");
            }

            throw error;
        }
    }

    async findOne(id: number, userId?: number): Promise<EpisodeDetailsDto> {
        const episode = await this.prisma.episode.findFirst({
            where: { id },
            include: {
                reviews: {
                    include: {
                        user: true,
                        upvotes: { select: { user: true } },
                        downvotes: { select: { user: true } },
                        _count: {
                            select: {
                                upvotes: true,
                                downvotes: true,
                            },
                        },
                    },
                },
            },
        });

        if (!episode) {
            throw new NotFoundException(`Episode with ID ${id} not found`);
        }

        const ratingsInfo = await this.getEpisodeRatings([id]);
        const bookmarkInfo = userId ? await this.getBookmarkStatus(id, userId) : { isBookmarked: false };
        const reviewInfo = userId ? await this.getReviewStatus(id, userId) : { isReviewed: false };

        return EpisodeMapper.toDtoWithDetails(episode, ratingsInfo[id], bookmarkInfo, reviewInfo);
    }

    async findBySeasonId(seasonId: number, userId?: number): Promise<EpisodeListResponseDto> {
        try {
            const episodes = await this.prisma.episode.findMany({
                where: { seasonId },
                orderBy: { id: "asc" },
            });

            const episodeIds = episodes.map((episode) => episode.id);
            const ratingsInfo = await this.getEpisodeRatings(episodeIds);

            const episodesWithDetails = await Promise.all(
                episodes.map(async (episode) => {
                    const bookmarkInfo = userId
                        ? await this.getBookmarkStatus(episode.id, userId)
                        : { isBookmarked: false };
                    const reviewInfo = userId ? await this.getReviewStatus(episode.id, userId) : { isReviewed: false };
                    return EpisodeMapper.toDtoWithDetails(episode, ratingsInfo[episode.id], bookmarkInfo, reviewInfo);
                }),
            );

            return EpisodeMapper.toListResponseDto({ episodes: episodesWithDetails, count: episodesWithDetails.length });
        } catch (error) {
            throw error;
        }
    }

    async create(createEpisodeDto: CreateEpisodeDto): Promise<EpisodeDetailsDto> {
        const episode = await this.prisma.episode.create({
            data: {
                title: createEpisodeDto.title,
                description: createEpisodeDto.description,
                photoSrc: createEpisodeDto.photoSrc,
                photoSrcProd: createEpisodeDto.photoSrcProd,
                trailerSrc: createEpisodeDto.trailerSrc || "",
                duration: createEpisodeDto.duration,
                dateAired: createEpisodeDto.dateAired ? new Date(createEpisodeDto.dateAired) : null,
                ratingImdb: createEpisodeDto.ratingImdb,
                seasonId: createEpisodeDto.seasonId,
            },
        });

        return EpisodeMapper.toDto(episode);
    }

    async update(id: number, updateEpisodeDto: UpdateEpisodeDto): Promise<EpisodeDetailsDto> {
        const episode = await this.prisma.episode.findFirst({
            where: { id },
        });

        if (!episode) {
            throw new NotFoundException(`Episode with ID ${id} not found`);
        }

        const updated = await this.prisma.episode.update({
            where: { id },
            data: {
                title: updateEpisodeDto.title ?? episode.title,
                description: updateEpisodeDto.description ?? episode.description,
                photoSrc: updateEpisodeDto.photoSrc ?? episode.photoSrc,
                photoSrcProd: updateEpisodeDto.photoSrcProd ?? episode.photoSrcProd,
                trailerSrc: updateEpisodeDto.trailerSrc ?? episode.trailerSrc,
                duration: updateEpisodeDto.duration ?? episode.duration,
                dateAired: updateEpisodeDto.dateAired ? new Date(updateEpisodeDto.dateAired) : episode.dateAired,
                ratingImdb: updateEpisodeDto.ratingImdb ?? episode.ratingImdb,
            },
        });

        return EpisodeMapper.toDto(updated);
    }

    async delete(id: number): Promise<void> {
        const episode = await this.prisma.episode.findFirst({
            where: { id },
        });

        if (!episode) {
            throw new NotFoundException(`Episode with ID ${id} not found`);
        }

        await this.prisma.episode.delete({
            where: { id },
        });
    }

    async getEpisodeRatings(episodeIds: number[]): Promise<Record<number, IEpisodeRatingInfo>> {
        if (episodeIds.length === 0) {
            return {};
        }

        const reviews = await this.prisma.episodeReview.findMany({
            where: {
                episodeId: { in: episodeIds },
            },
        });

        const ratingsMap: Record<number, IEpisodeRatingInfo> = {};

        episodeIds.forEach((episodeId) => {
            const episodeReviews = reviews.filter((r) => r.episodeId === episodeId);
            const ratings = episodeReviews.filter((r) => r.rating !== null).map((r) => r.rating);

            ratingsMap[episodeId] = {
                averageRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
                totalReviews: episodeReviews.length,
            };
        });

        return ratingsMap;
    }

    private async getBookmarkStatus(episodeId: number, userId: number): Promise<{ isBookmarked: boolean }> {
        const bookmark = await this.prisma.userEpisodeFavorite.findFirst({
            where: { episodeId, userId },
        });

        return { isBookmarked: !!bookmark };
    }

    private async getReviewStatus(episodeId: number, userId: number): Promise<{ isReviewed: boolean }> {
        const review = await this.prisma.episodeReview.findFirst({
            where: { episodeId, userId },
        });

        return { isReviewed: !!review };
    }
}
