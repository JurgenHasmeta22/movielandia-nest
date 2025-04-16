import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { MovieQueryDto } from "./dtos/movie-query.dto";
import { CreateMovieDto } from "./dtos/create-movie.dto";
import { UpdateMovieDto } from "./dtos/update-movie.dto";
import { MovieListResponseDto, MovieDetailsDto, RelatedMoviesResponseDto } from "./dtos/movie-response.dto";
import { MovieMapper } from "./movie.mapper";
import { MovieParser } from "./movie.parser";
import { IMovieRatingInfo } from "./movie.interface";
import { getCacheConfig, CACHE_TTL, shouldSkipCache } from "../../utils/cache.util";

@Injectable()
export class MovieService {
    constructor(private prisma: PrismaService) {}

    async findAll(query: MovieQueryDto, userId?: number): Promise<MovieListResponseDto> {
        const cacheConfig = getCacheConfig("movies:list", { query, userId }, CACHE_TTL.SHORT);

        if (!shouldSkipCache({ method: "GET" })) {
            // Cache implementation would go here
        }

        try {
            const { filters, orderByObject, skip, take } = MovieParser.parseMovieQuery(query);

            const movies = await this.prisma.movie.findMany({
                where: filters,
                orderBy: orderByObject,
                skip,
                take,
            });

            const movieIds = movies.map((movie) => movie.id);
            const ratingsInfo = await this.getMovieRatings(movieIds);

            const moviesWithDetails = await Promise.all(
                movies.map(async (movie) => {
                    const bookmarkInfo = userId
                        ? await this.getBookmarkStatus(movie.id, userId)
                        : { isBookmarked: false };
                    return MovieMapper.toDtoWithDetails(movie, ratingsInfo[movie.id], bookmarkInfo);
                }),
            );

            const totalCount = await this.prisma.movie.count({ where: filters });

            return MovieMapper.toListResponseDto({ movies: moviesWithDetails, count: totalCount });
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

    async findOne(id: number, userId?: number): Promise<MovieDetailsDto> {
        const movie = await this.prisma.movie.findFirst({
            where: { id },
            include: {
                genres: { select: { genre: true } },
                cast: { include: { actor: true } },
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

        if (!movie) {
            throw new NotFoundException("Movie not found");
        }

        const ratingsInfo = await this.getMovieRatings([movie.id]);
        const bookmarkInfo = userId ? await this.getBookmarkStatus(movie.id, userId) : { isBookmarked: false };
        const reviewInfo = userId ? await this.getReviewStatus(movie.id, userId) : { isReviewed: false };

        return MovieMapper.toDtoWithDetails(movie, ratingsInfo[movie.id], bookmarkInfo, reviewInfo);
    }

    async findLatest(userId?: number): Promise<MovieDetailsDto[]> {
        const movies = await this.prisma.movie.findMany({
            orderBy: { dateAired: "desc" },
            take: 6,
        });

        const movieIds = movies.map((movie) => movie.id);
        const ratingsInfo = await this.getMovieRatings(movieIds);

        return Promise.all(
            movies.map(async (movie) => {
                const bookmarkInfo = userId ? await this.getBookmarkStatus(movie.id, userId) : { isBookmarked: false };
                return MovieMapper.toDtoWithDetails(movie, ratingsInfo[movie.id], bookmarkInfo);
            }),
        );
    }

    async findRelated(
        id: number,
        userId?: number,
        page: number = 1,
        perPage: number = 6,
    ): Promise<RelatedMoviesResponseDto> {
        const skip = (page - 1) * perPage;

        const movie = await this.prisma.movie.findFirst({
            where: { id },
        });

        if (!movie) {
            throw new NotFoundException("Movie not found");
        }

        const movieGenres = await this.prisma.movieGenre.findMany({
            where: { movieId: movie.id },
            select: { genreId: true },
        });

        if (!movieGenres.length) {
            return { movies: null, count: 0 };
        }

        const genreIds = movieGenres.map((mg) => mg.genreId);
        const relatedMovieIdsByGenre = await this.prisma.movieGenre.findMany({
            where: {
                genreId: { in: genreIds },
                movieId: { not: movie.id },
            },
            distinct: ["movieId"],
            select: { movieId: true },
        });

        const relatedMovieIds = relatedMovieIdsByGenre.map((rm) => rm.movieId);

        if (!relatedMovieIds.length) {
            return { movies: null, count: 0 };
        }

        const totalCount = relatedMovieIds.length;

        const relatedMovies = await this.prisma.movie.findMany({
            where: { id: { in: relatedMovieIds } },
            skip,
            take: perPage,
        });

        const ratingsInfo = await this.getMovieRatings(relatedMovieIds);

        const moviesWithDetails = await Promise.all(
            relatedMovies.map(async (movie) => {
                const bookmarkInfo = userId ? await this.getBookmarkStatus(movie.id, userId) : { isBookmarked: false };
                return MovieMapper.toDtoWithDetails(movie, ratingsInfo[movie.id], bookmarkInfo);
            }),
        );

        return { movies: moviesWithDetails, count: totalCount };
    }

    async search(title: string, query: MovieQueryDto, userId?: number): Promise<MovieListResponseDto> {
        const { ascOrDesc, sortBy } = query;
        const orderByObject = { [sortBy || "title"]: ascOrDesc || "asc" };

        const movies = await this.prisma.movie.findMany({
            where: { title: { contains: title.toLowerCase() } },
            orderBy: orderByObject,
            skip: query.page ? (query.page - 1) * 12 : 0,
            take: 12,
        });

        const movieIds = movies.map((movie) => movie.id);
        const ratingsInfo = await this.getMovieRatings(movieIds);

        const moviesWithDetails = await Promise.all(
            movies.map(async (movie) => {
                const bookmarkInfo = userId ? await this.getBookmarkStatus(movie.id, userId) : { isBookmarked: false };
                return MovieMapper.toDtoWithDetails(movie, ratingsInfo[movie.id], bookmarkInfo);
            }),
        );

        const count = await this.prisma.movie.count({
            where: { title: { contains: title.toLowerCase() } },
        });

        return MovieMapper.toListResponseDto({ movies: moviesWithDetails, count });
    }

    async create(createMovieDto: CreateMovieDto): Promise<MovieDetailsDto> {
        const movie = await this.prisma.movie.create({
            data: {
                title: createMovieDto.title.toLowerCase(),
                description: createMovieDto.description,
                photoSrc: createMovieDto.photoSrc,
                photoSrcProd: createMovieDto.photoSrcProd,
                trailerSrc: createMovieDto.trailerSrc,
                duration: createMovieDto.duration,
                ratingImdb: createMovieDto.ratingImdb,
                dateAired: createMovieDto.dateAired || new Date(),
            },
            include: { genres: { select: { genre: true } } },
        });

        return MovieMapper.toDto(movie);
    }

    async update(id: number, updateMovieDto: UpdateMovieDto): Promise<MovieDetailsDto> {
        const movie = await this.prisma.movie.findFirst({
            where: { id },
        });

        if (!movie) {
            throw new NotFoundException("Movie not found");
        }

        const updatedMovie = await this.prisma.movie.update({
            where: { id },
            data: {
                ...(updateMovieDto.title && { title: updateMovieDto.title.toLowerCase() }),
                ...(updateMovieDto.description && { description: updateMovieDto.description }),
                ...(updateMovieDto.photoSrc && { photoSrc: updateMovieDto.photoSrc }),
                ...(updateMovieDto.photoSrcProd && { photoSrcProd: updateMovieDto.photoSrcProd }),
                ...(updateMovieDto.trailerSrc && { trailerSrc: updateMovieDto.trailerSrc }),
                ...(updateMovieDto.duration && { duration: updateMovieDto.duration }),
                ...(updateMovieDto.ratingImdb && { ratingImdb: updateMovieDto.ratingImdb }),
                ...(updateMovieDto.dateAired && { dateAired: updateMovieDto.dateAired }),
            },
            include: { genres: { select: { genre: true } } },
        });

        return MovieMapper.toDto(updatedMovie);
    }

    async remove(id: number): Promise<void> {
        const movie = await this.prisma.movie.findFirst({
            where: { id },
        });

        if (!movie) {
            throw new NotFoundException("Movie not found");
        }

        await this.prisma.movie.delete({
            where: { id },
        });
    }

    async count(): Promise<number> {
        return this.prisma.movie.count();
    }

    private async getMovieRatings(movieIds: number[]): Promise<{ [key: number]: IMovieRatingInfo }> {
        const movieRatings = await this.prisma.movieReview.groupBy({
            by: ["movieId"],
            where: { movieId: { in: movieIds } },
            _avg: { rating: true },
            _count: { rating: true },
        });

        return movieRatings.reduce((acc, rating) => {
            acc[rating.movieId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };
            return acc;
        }, {});
    }

    private async getBookmarkStatus(movieId: number, userId: number) {
        const existingFavorite = await this.prisma.userMovieFavorite.findFirst({
            where: {
                AND: [{ userId }, { movieId }],
            },
        });

        return { isBookmarked: !!existingFavorite };
    }

    private async getReviewStatus(movieId: number, userId: number) {
        const existingReview = await this.prisma.movieReview.findFirst({
            where: {
                AND: [{ userId }, { movieId }],
            },
        });

        return { isReviewed: !!existingReview };
    }
}
