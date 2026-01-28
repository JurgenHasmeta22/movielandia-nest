import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { SeasonQueryDto } from "./dtos/season-query.dto";
import { CreateSeasonDto } from "./dtos/create-season.dto";
import { UpdateSeasonDto } from "./dtos/update-season.dto";
import { SeasonListResponseDto, SeasonDetailsDto } from "./dtos/season-response.dto";
import { SeasonMapper } from "./season.mapper";
import { SeasonParser } from "./season.parser";
import { ISeasonRatingInfo } from "./season.interface";
import { getCacheConfig, CACHE_TTL, shouldSkipCache } from "../../utils/cache.util";

@Injectable()
export class SeasonService {
    constructor(private prisma: PrismaService) {}

    async findAll(query: SeasonQueryDto, userId?: number): Promise<SeasonListResponseDto> {
        try {
            const { filters, orderByObject, skip, take } = SeasonParser.parseSeasonQuery(query);

            const seasons = await this.prisma.season.findMany({
                where: filters,
                orderBy: orderByObject,
                skip,
                take,
            });

            const seasonIds = seasons.map((season) => season.id);
            const ratingsInfo = await this.getSeasonRatings(seasonIds);

            const seasonsWithDetails = await Promise.all(
                seasons.map(async (season) => {
                    const bookmarkInfo = userId
                        ? await this.getBookmarkStatus(season.id, userId)
                        : { isBookmarked: false };
                    const reviewInfo = userId ? await this.getReviewStatus(season.id, userId) : { isReviewed: false };
                    return SeasonMapper.toDtoWithDetails(season, ratingsInfo[season.id], bookmarkInfo, reviewInfo);
                }),
            );

            const totalCount = await this.prisma.season.count({ where: filters });

            return SeasonMapper.toListResponseDto({ seasons: seasonsWithDetails, count: totalCount });
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

    async findOne(id: number, userId?: number): Promise<SeasonDetailsDto> {
        const season = await this.prisma.season.findFirst({
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

        if (!season) {
            throw new NotFoundException(`Season with ID ${id} not found`);
        }

        const ratingsInfo = await this.getSeasonRatings([id]);
        const bookmarkInfo = userId ? await this.getBookmarkStatus(id, userId) : { isBookmarked: false };
        const reviewInfo = userId ? await this.getReviewStatus(id, userId) : { isReviewed: false };

        return SeasonMapper.toDtoWithDetails(season, ratingsInfo[id], bookmarkInfo, reviewInfo);
    }

    async findBySerieId(serieId: number, userId?: number): Promise<SeasonListResponseDto> {
        try {
            const seasons = await this.prisma.season.findMany({
                where: { serieId },
                orderBy: { id: "asc" },
            });

            const seasonIds = seasons.map((season) => season.id);
            const ratingsInfo = await this.getSeasonRatings(seasonIds);

            const seasonsWithDetails = await Promise.all(
                seasons.map(async (season) => {
                    const bookmarkInfo = userId
                        ? await this.getBookmarkStatus(season.id, userId)
                        : { isBookmarked: false };
                    const reviewInfo = userId ? await this.getReviewStatus(season.id, userId) : { isReviewed: false };
                    return SeasonMapper.toDtoWithDetails(season, ratingsInfo[season.id], bookmarkInfo, reviewInfo);
                }),
            );

            return SeasonMapper.toListResponseDto({ seasons: seasonsWithDetails, count: seasonsWithDetails.length });
        } catch (error) {
            throw error;
        }
    }

    async create(createSeasonDto: CreateSeasonDto): Promise<SeasonDetailsDto> {
        const season = await this.prisma.season.create({
            data: {
                title: createSeasonDto.title,
                description: createSeasonDto.description,
                photoSrc: createSeasonDto.photoSrc,
                photoSrcProd: createSeasonDto.photoSrcProd,
                trailerSrc: createSeasonDto.trailerSrc || "",
                dateAired: createSeasonDto.dateAired ? new Date(createSeasonDto.dateAired) : null,
                ratingImdb: createSeasonDto.ratingImdb,
                serieId: createSeasonDto.serieId,
            },
        });

        return SeasonMapper.toDto(season);
    }

    async update(id: number, updateSeasonDto: UpdateSeasonDto): Promise<SeasonDetailsDto> {
        const season = await this.prisma.season.findFirst({
            where: { id },
        });

        if (!season) {
            throw new NotFoundException(`Season with ID ${id} not found`);
        }

        const updated = await this.prisma.season.update({
            where: { id },
            data: {
                title: updateSeasonDto.title ?? season.title,
                description: updateSeasonDto.description ?? season.description,
                photoSrc: updateSeasonDto.photoSrc ?? season.photoSrc,
                photoSrcProd: updateSeasonDto.photoSrcProd ?? season.photoSrcProd,
                trailerSrc: updateSeasonDto.trailerSrc ?? season.trailerSrc,
                dateAired: updateSeasonDto.dateAired ? new Date(updateSeasonDto.dateAired) : season.dateAired,
                ratingImdb: updateSeasonDto.ratingImdb ?? season.ratingImdb,
            },
        });

        return SeasonMapper.toDto(updated);
    }

    async delete(id: number): Promise<void> {
        const season = await this.prisma.season.findFirst({
            where: { id },
        });

        if (!season) {
            throw new NotFoundException(`Season with ID ${id} not found`);
        }

        await this.prisma.season.delete({
            where: { id },
        });
    }

    async getSeasonRatings(seasonIds: number[]): Promise<Record<number, ISeasonRatingInfo>> {
        if (seasonIds.length === 0) {
            return {};
        }

        const reviews = await this.prisma.seasonReview.findMany({
            where: {
                seasonId: { in: seasonIds },
            },
        });

        const ratingsMap: Record<number, ISeasonRatingInfo> = {};

        seasonIds.forEach((seasonId) => {
            const seasonReviews = reviews.filter((r) => r.seasonId === seasonId);
            const ratings = seasonReviews.filter((r) => r.rating !== null).map((r) => r.rating);

            ratingsMap[seasonId] = {
                averageRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
                totalReviews: seasonReviews.length,
            };
        });

        return ratingsMap;
    }

    private async getBookmarkStatus(seasonId: number, userId: number): Promise<{ isBookmarked: boolean }> {
        const bookmark = await this.prisma.userSeasonFavorite.findFirst({
            where: { seasonId, userId },
        });

        return { isBookmarked: !!bookmark };
    }

    private async getReviewStatus(seasonId: number, userId: number): Promise<{ isReviewed: boolean }> {
        const review = await this.prisma.seasonReview.findFirst({
            where: { seasonId, userId },
        });

        return { isReviewed: !!review };
    }
}
