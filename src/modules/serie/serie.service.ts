import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { SerieQueryDto } from "./dtos/serie-query.dto";
import { CreateSerieDto } from "./dtos/create-serie.dto";
import { UpdateSerieDto } from "./dtos/update-serie.dto";
import { SerieListResponseDto, SerieDetailsDto, RelatedSeriesResponseDto } from "./dtos/serie-response.dto";
import { SerieMapper } from "./serie.mapper";
import { SerieParser } from "./serie.parser";
import { ISerieRatingInfo } from "./serie.interface";
import { getCacheConfig, CACHE_TTL, shouldSkipCache } from "../../utils/cache.util";

@Injectable()
export class SerieService {
    constructor(private prisma: PrismaService) {}

    async findAll(query: SerieQueryDto, userId?: number): Promise<SerieListResponseDto> {
        const cacheConfig = getCacheConfig("series:list", { query, userId }, CACHE_TTL.SHORT);

        if (!shouldSkipCache({ method: "GET" })) {
            // Cache implementation would go here
        }

        try {
            const { filters, orderByObject, skip, take } = SerieParser.parseSerieQuery(query);

            const series = await this.prisma.serie.findMany({
                where: filters,
                orderBy: orderByObject,
                skip,
                take,
            });

            const serieIds = series.map((serie) => serie.id);
            const ratingsInfo = await this.getSerieRatings(serieIds);

            const seriesWithDetails = await Promise.all(
                series.map(async (serie) => {
                    const bookmarkInfo = userId
                        ? await this.getBookmarkStatus(serie.id, userId)
                        : { isBookmarked: false };
                    return SerieMapper.toDtoWithDetails(serie, ratingsInfo[serie.id], bookmarkInfo);
                }),
            );

            const totalCount = await this.prisma.serie.count({ where: filters });

            return SerieMapper.toListResponseDto({ series: seriesWithDetails, count: totalCount });
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

    async findOne(id: number, userId?: number): Promise<SerieDetailsDto> {
        const serie = await this.prisma.serie.findFirst({
            where: { id },
            include: {
                genres: { select: { genre: true } },
                cast: { include: { actor: true } },
                crew: { include: { crew: true } },
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

        if (!serie) {
            throw new NotFoundException("Serie not found");
        }

        const ratingsInfo = await this.getSerieRatings([serie.id]);
        const bookmarkInfo = userId ? await this.getBookmarkStatus(serie.id, userId) : { isBookmarked: false };
        const reviewInfo = userId ? await this.getReviewStatus(serie.id, userId) : { isReviewed: false };

        return SerieMapper.toDtoWithDetails(serie, ratingsInfo[serie.id], bookmarkInfo, reviewInfo);
    }

    async findLatest(userId?: number): Promise<SerieDetailsDto[]> {
        const series = await this.prisma.serie.findMany({
            orderBy: { dateAired: "desc" },
            take: 6,
        });

        const serieIds = series.map((serie) => serie.id);
        const ratingsInfo = await this.getSerieRatings(serieIds);

        return Promise.all(
            series.map(async (serie) => {
                const bookmarkInfo = userId ? await this.getBookmarkStatus(serie.id, userId) : { isBookmarked: false };
                return SerieMapper.toDtoWithDetails(serie, ratingsInfo[serie.id], bookmarkInfo);
            }),
        );
    }

    async findRelated(
        id: number,
        userId?: number,
        page: number = 1,
        perPage: number = 6,
    ): Promise<RelatedSeriesResponseDto> {
        const skip = (page - 1) * perPage;

        const serie = await this.prisma.serie.findFirst({
            where: { id },
        });

        if (!serie) {
            throw new NotFoundException("Serie not found");
        }

        const serieGenres = await this.prisma.serieGenre.findMany({
            where: { serieId: serie.id },
            select: { genreId: true },
        });

        if (!serieGenres.length) {
            return { series: null, count: 0 };
        }

        const genreIds = serieGenres.map((sg) => sg.genreId);
        const relatedSerieIdsByGenre = await this.prisma.serieGenre.findMany({
            where: {
                genreId: { in: genreIds },
                serieId: { not: serie.id },
            },
            distinct: ["serieId"],
            select: { serieId: true },
        });

        const relatedSerieIds = relatedSerieIdsByGenre.map((rs) => rs.serieId);

        if (!relatedSerieIds.length) {
            return { series: null, count: 0 };
        }

        const totalCount = relatedSerieIds.length;

        const relatedSeries = await this.prisma.serie.findMany({
            where: { id: { in: relatedSerieIds } },
            skip,
            take: perPage,
        });

        const ratingsInfo = await this.getSerieRatings(relatedSerieIds);

        const seriesWithDetails = await Promise.all(
            relatedSeries.map(async (serie) => {
                const bookmarkInfo = userId ? await this.getBookmarkStatus(serie.id, userId) : { isBookmarked: false };
                return SerieMapper.toDtoWithDetails(serie, ratingsInfo[serie.id], bookmarkInfo);
            }),
        );

        return { series: seriesWithDetails, count: totalCount };
    }

    async search(title: string, query: SerieQueryDto, userId?: number): Promise<SerieListResponseDto> {
        const { ascOrDesc, sortBy } = query;
        const orderByObject = { [sortBy || "title"]: ascOrDesc || "asc" };

        const series = await this.prisma.serie.findMany({
            where: { title: { contains: title.toLowerCase() } },
            orderBy: orderByObject,
            skip: query.page ? (query.page - 1) * 12 : 0,
            take: 12,
        });

        const serieIds = series.map((serie) => serie.id);
        const ratingsInfo = await this.getSerieRatings(serieIds);

        const seriesWithDetails = await Promise.all(
            series.map(async (serie) => {
                const bookmarkInfo = userId ? await this.getBookmarkStatus(serie.id, userId) : { isBookmarked: false };
                return SerieMapper.toDtoWithDetails(serie, ratingsInfo[serie.id], bookmarkInfo);
            }),
        );

        const count = await this.prisma.serie.count({
            where: { title: { contains: title.toLowerCase() } },
        });

        return SerieMapper.toListResponseDto({ series: seriesWithDetails, count });
    }

    async create(createSerieDto: CreateSerieDto): Promise<SerieDetailsDto> {
        const serie = await this.prisma.serie.create({
            data: {
                title: createSerieDto.title.toLowerCase(),
                description: createSerieDto.description,
                photoSrc: createSerieDto.photoSrc,
                photoSrcProd: createSerieDto.photoSrcProd,
                trailerSrc: createSerieDto.trailerSrc,
                ratingImdb: createSerieDto.ratingImdb,
                dateAired: createSerieDto.dateAired || new Date(),
            },
            include: { genres: { select: { genre: true } } },
        });

        return SerieMapper.toDto(serie);
    }

    async update(id: number, updateSerieDto: UpdateSerieDto): Promise<SerieDetailsDto> {
        const serie = await this.prisma.serie.findFirst({
            where: { id },
        });

        if (!serie) {
            throw new NotFoundException("Serie not found");
        }

        const updatedSerie = await this.prisma.serie.update({
            where: { id },
            data: {
                ...(updateSerieDto.title && { title: updateSerieDto.title.toLowerCase() }),
                ...(updateSerieDto.description && { description: updateSerieDto.description }),
                ...(updateSerieDto.photoSrc && { photoSrc: updateSerieDto.photoSrc }),
                ...(updateSerieDto.photoSrcProd && { photoSrcProd: updateSerieDto.photoSrcProd }),
                ...(updateSerieDto.trailerSrc && { trailerSrc: updateSerieDto.trailerSrc }),
                ...(updateSerieDto.ratingImdb && { ratingImdb: updateSerieDto.ratingImdb }),
                ...(updateSerieDto.dateAired && { dateAired: updateSerieDto.dateAired }),
            },
            include: { genres: { select: { genre: true } } },
        });

        return SerieMapper.toDto(updatedSerie);
    }

    async remove(id: number): Promise<void> {
        const serie = await this.prisma.serie.findFirst({
            where: { id },
        });

        if (!serie) {
            throw new NotFoundException("Serie not found");
        }

        await this.prisma.serie.delete({
            where: { id },
        });
    }

    async count(): Promise<number> {
        return this.prisma.serie.count();
    }

    private async getSerieRatings(serieIds: number[]): Promise<{ [key: number]: ISerieRatingInfo }> {
        const serieRatings = await this.prisma.serieReview.groupBy({
            by: ["serieId"],
            where: { serieId: { in: serieIds } },
            _avg: { rating: true },
            _count: { rating: true },
        });

        return serieRatings.reduce((acc, rating) => {
            acc[rating.serieId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };
            return acc;
        }, {});
    }

    private async getBookmarkStatus(serieId: number, userId: number) {
        const existingFavorite = await this.prisma.userSerieFavorite.findFirst({
            where: {
                AND: [{ userId }, { serieId }],
            },
        });

        return { isBookmarked: !!existingFavorite };
    }

    private async getReviewStatus(serieId: number, userId: number) {
        const existingReview = await this.prisma.serieReview.findFirst({
            where: {
                AND: [{ userId }, { serieId }],
            },
        });

        return { isReviewed: !!existingReview };
    }
}
