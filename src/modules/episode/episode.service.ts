import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { EpisodeQueryDto } from "./dtos/episode-query.dto";
import { CreateEpisodeDto } from "./dtos/create-episode.dto";
import { UpdateEpisodeDto } from "./dtos/update-episode.dto";
import { EpisodeListResponseDto, EpisodeDetailsDto } from "./dtos/episode-response.dto";
import { IEpisodeRatingInfo } from "./episode.interface";
import { truncateText } from "../../utils/transform.util";
import { getCacheConfig, CACHE_TTL, shouldSkipCache } from "../../utils/cache.util";

@Injectable()
export class EpisodeService {
    constructor(private prisma: PrismaService) {}

    async findAll(query: EpisodeQueryDto, userId?: number): Promise<EpisodeListResponseDto> {
        try {
            const page = Math.max(1, query.page || 1);
            const pageSize = Math.min(Math.max(1, query.pageSize || 10), 100);
            const skip = (page - 1) * pageSize;
            const take = pageSize;
            const filters: any = {};
            if (query.seasonId) filters.seasonId = parseInt(query.seasonId as any);
            if (query.search) {
                filters.OR = [
                    { title: { contains: query.search, mode: "insensitive" } },
                    { description: { contains: query.search, mode: "insensitive" } },
                ];
            }
            if (query.minRating !== undefined && query.maxRating !== undefined) {
                const minRating = parseFloat(query.minRating as any);
                const maxRating = parseFloat(query.maxRating as any);
                if (minRating < 0 || maxRating > 10 || minRating > maxRating) {
                    throw new BadRequestException(
                        "Rating must be between 0 and 10, and minRating must be less than maxRating",
                    );
                }
                filters.ratingImdb = { gte: minRating, lte: maxRating };
            }
            const orderByObject: any = {};
            if (query.sortBy === "rating") orderByObject.ratingImdb = query.sortOrder || "desc";
            else if (query.sortBy === "date") orderByObject.dateAired = query.sortOrder || "desc";
            else if (query.sortBy === "duration") orderByObject.duration = query.sortOrder || "asc";
            else if (query.sortBy === "title") orderByObject.title = query.sortOrder || "asc";
            else orderByObject.id = "desc";

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
                    return this.mapToDetails(episode, ratingsInfo[episode.id], bookmarkInfo, reviewInfo);
                }),
            );

            const totalCount = await this.prisma.episode.count({ where: filters });

            return { episodes: episodesWithDetails, count: totalCount };
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
                season: {
                    select: {
                        id: true,
                        title: true,
                        serie: { select: { id: true, title: true } },
                    },
                },
                reviews: {
                    include: {
                        user: true,
                        upvotes: { select: { userId: true } },
                        downvotes: { select: { userId: true } },
                        _count: {
                            select: {
                                upvotes: true,
                                downvotes: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!episode) {
            throw new NotFoundException(`Episode with ID ${id} not found`);
        }

        const ratingsInfo = await this.getEpisodeRatings([id]);
        const bookmarkInfo = userId ? await this.getBookmarkStatus(id, userId) : { isBookmarked: false };
        const reviewInfo = userId ? await this.getReviewStatus(id, userId) : { isReviewed: false };

        return this.mapToDetails(episode, ratingsInfo[id], bookmarkInfo, reviewInfo, userId);
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
                    return this.mapToDetails(episode, ratingsInfo[episode.id], bookmarkInfo, reviewInfo);
                }),
            );

            return { episodes: episodesWithDetails, count: episodesWithDetails.length };
        } catch (error) {
            throw error;
        }
    }

    async search(
        title: string,
        userId?: number,
        page: number = 1,
        perPage: number = 12,
    ): Promise<EpisodeListResponseDto> {
        const skip = (page - 1) * perPage;

        const episodes = await this.prisma.episode.findMany({
            where: { title: { contains: title.toLowerCase() } },
            orderBy: { title: "asc" },
            skip,
            take: perPage,
        });

        const episodeIds = episodes.map((episode) => episode.id);
        const ratingsInfo = await this.getEpisodeRatings(episodeIds);

        const episodesWithDetails = await Promise.all(
            episodes.map(async (episode) => {
                const bookmarkInfo = userId
                    ? await this.getBookmarkStatus(episode.id, userId)
                    : { isBookmarked: false };
                const reviewInfo = userId ? await this.getReviewStatus(episode.id, userId) : { isReviewed: false };
                return this.mapToDetails(episode, ratingsInfo[episode.id], bookmarkInfo, reviewInfo);
            }),
        );

        const count = await this.prisma.episode.count({
            where: { title: { contains: title.toLowerCase() } },
        });

        return { episodes: episodesWithDetails, count };
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

        return episode as EpisodeDetailsDto;
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

        return updated as EpisodeDetailsDto;
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

    private mapToDetails(
        episode: any,
        ratingInfo?: IEpisodeRatingInfo,
        bookmarkInfo?: { isBookmarked: boolean },
        reviewInfo?: { isReviewed: boolean },
        userId?: number,
    ): EpisodeDetailsDto {
        return {
            id: episode.id,
            title: episode.title,
            description: episode.description ? truncateText(episode.description, 200) : undefined,
            photoSrc: episode.photoSrc,
            photoSrcProd: episode.photoSrcProd,
            trailerSrc: episode.trailerSrc,
            ratingImdb: episode.ratingImdb,
            dateAired: episode.dateAired,
            duration: episode.duration,
            seasonId: episode.seasonId,
            season: episode.season ?? undefined,
            ratings: ratingInfo
                ? { averageRating: ratingInfo.averageRating, totalReviews: ratingInfo.totalReviews }
                : undefined,
            isBookmarked: bookmarkInfo?.isBookmarked || false,
            isReviewed: reviewInfo?.isReviewed || false,
            reviews: episode.reviews?.map((review: any) => ({
                id: review.id,
                rating: review.rating,
                content: review.content,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
                user: { id: review.user.id, userName: review.user.userName, avatar: review.user.avatar },
                isUpvoted: userId ? review.upvotes?.some((v: any) => v.userId === userId) || false : false,
                isDownvoted: userId ? review.downvotes?.some((v: any) => v.userId === userId) || false : false,
                _count: review._count,
            })),
        };
    }
}
