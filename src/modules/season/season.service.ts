import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { SeasonQueryDto } from "./dtos/season-query.dto";
import { CreateSeasonDto } from "./dtos/create-season.dto";
import { UpdateSeasonDto } from "./dtos/update-season.dto";
import { SeasonListResponseDto, SeasonDetailsDto } from "./dtos/season-response.dto";
import { ISeasonRatingInfo } from "./season.interface";
import { truncateText } from "../../utils/transform.util";
import { getCacheConfig, CACHE_TTL, shouldSkipCache } from "../../utils/cache.util";

@Injectable()
export class SeasonService {
    constructor(private prisma: PrismaService) {}

    async findAll(query: SeasonQueryDto, userId?: number): Promise<SeasonListResponseDto> {
        try {
            const page = Math.max(1, query.page || 1);
            const pageSize = Math.min(Math.max(1, query.pageSize || 10), 100);
            const skip = (page - 1) * pageSize;
            const take = pageSize;
            const filters: any = {};
            if (query.serieId) filters.serieId = parseInt(query.serieId as any);
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
            else if (query.sortBy === "title") orderByObject.title = query.sortOrder || "asc";
            else orderByObject.id = "desc";

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
                    return this.mapToDetails(season, ratingsInfo[season.id], bookmarkInfo, reviewInfo);
                }),
            );

            const totalCount = await this.prisma.season.count({ where: filters });

            return { seasons: seasonsWithDetails, count: totalCount };
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
                serie: { select: { id: true, title: true } },
                episodes: {
                    orderBy: { id: 'asc' },
                    select: { id: true, title: true, photoSrc: true, description: true, duration: true, ratingImdb: true },
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

        if (!season) {
            throw new NotFoundException(`Season with ID ${id} not found`);
        }

        const ratingsInfo = await this.getSeasonRatings([id]);
        const bookmarkInfo = userId ? await this.getBookmarkStatus(id, userId) : { isBookmarked: false };
        const reviewInfo = userId ? await this.getReviewStatus(id, userId) : { isReviewed: false };

        return this.mapToDetails(season, ratingsInfo[id], bookmarkInfo, reviewInfo, userId);
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
                    return this.mapToDetails(season, ratingsInfo[season.id], bookmarkInfo, reviewInfo);
                }),
            );

            return { seasons: seasonsWithDetails, count: seasonsWithDetails.length };
        } catch (error) {
            throw error;
        }
    }

    async search(
        title: string,
        userId?: number,
        page: number = 1,
        perPage: number = 12,
    ): Promise<SeasonListResponseDto> {
        const skip = (page - 1) * perPage;

        const seasons = await this.prisma.season.findMany({
            where: { title: { contains: title.toLowerCase() } },
            orderBy: { title: "asc" },
            skip,
            take: perPage,
        });

        const seasonIds = seasons.map((season) => season.id);
        const ratingsInfo = await this.getSeasonRatings(seasonIds);

        const seasonsWithDetails = await Promise.all(
            seasons.map(async (season) => {
                const bookmarkInfo = userId ? await this.getBookmarkStatus(season.id, userId) : { isBookmarked: false };
                const reviewInfo = userId ? await this.getReviewStatus(season.id, userId) : { isReviewed: false };
                return this.mapToDetails(season, ratingsInfo[season.id], bookmarkInfo, reviewInfo);
            }),
        );

        const count = await this.prisma.season.count({
            where: { title: { contains: title.toLowerCase() } },
        });

        return { seasons: seasonsWithDetails, count };
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

        return season as SeasonDetailsDto;
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

        return updated as SeasonDetailsDto;
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

    private mapToDetails(
        season: any,
        ratingInfo?: ISeasonRatingInfo,
        bookmarkInfo?: { isBookmarked: boolean },
        reviewInfo?: { isReviewed: boolean },
        userId?: number,
    ): SeasonDetailsDto {
        return {
            id: season.id,
            title: season.title,
            description: season.description ? truncateText(season.description, 200) : undefined,
            photoSrc: season.photoSrc,
            photoSrcProd: season.photoSrcProd,
            trailerSrc: season.trailerSrc,
            ratingImdb: season.ratingImdb,
            dateAired: season.dateAired,
            serieId: season.serieId,
            serie: season.serie ?? undefined,
            episodes: season.episodes ?? undefined,
            ratings: ratingInfo
                ? { averageRating: ratingInfo.averageRating, totalReviews: ratingInfo.totalReviews }
                : undefined,
            isBookmarked: bookmarkInfo?.isBookmarked || false,
            isReviewed: reviewInfo?.isReviewed || false,
            reviews: season.reviews?.map((review: any) => ({
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
