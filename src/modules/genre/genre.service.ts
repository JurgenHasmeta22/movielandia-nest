import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { GenreQueryDto } from "./dtos/genre-query.dto";
import { CreateGenreDto } from "./dtos/create-genre.dto";
import { UpdateGenreDto } from "./dtos/update-genre.dto";
import { GenreListResponseDto, GenreDetailsDto } from "./dtos/genre-response.dto";

@Injectable()
export class GenreService {
    constructor(private prisma: PrismaService) {}

    async findAll(query: GenreQueryDto, userId?: number): Promise<GenreListResponseDto> {
        try {
            const { sortBy, ascOrDesc = "asc", perPage = 20, page = 1, name } = query;
            const filters: any = {};
            if (name) filters.name = { contains: name.toLowerCase() };
            const skip = (page - 1) * perPage;
            const take = perPage;
            const orderByObject: any = { [sortBy || "name"]: ascOrDesc };

            const genres = await this.prisma.genre.findMany({
                where: filters,
                orderBy: orderByObject,
                skip,
                take,
                include: {
                    _count: { select: { movies: true, series: true } },
                },
            });

            const genresWithDetails = await Promise.all(
                genres.map(async (genre) => {
                    const bookmarkInfo = userId
                        ? await this.getBookmarkStatus(genre.id, userId)
                        : { isBookmarked: false };
                    return this.mapToDetails(genre, bookmarkInfo);
                }),
            );

            const totalCount = await this.prisma.genre.count({ where: filters });

            return { genres: genresWithDetails, count: totalCount };
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

    async findOne(
        id: number,
        userId?: number,
        moviesPage = 1,
        seriesPage = 1,
        perPage = 12,
        sortBy = "title",
        ascOrDesc: "asc" | "desc" = "asc",
    ): Promise<GenreDetailsDto> {
        const moviesSkip = (moviesPage - 1) * perPage;
        const seriesSkip = (seriesPage - 1) * perPage;

        const allowedSortMovies = ["title", "dateAired", "ratingImdb"];
        const allowedSortSeries = ["title", "dateAired", "ratingImdb"];
        const safeMovieSortBy = allowedSortMovies.includes(sortBy) ? sortBy : "title";
        const safeSerieSortBy = allowedSortSeries.includes(sortBy) ? sortBy : "title";

        const genre = await this.prisma.genre.findFirst({
            where: { id },
            include: {
                movies: {
                    include: { movie: true },
                    take: perPage,
                    skip: moviesSkip,
                    orderBy: { movie: { [safeMovieSortBy]: ascOrDesc } },
                },
                series: {
                    include: { serie: true },
                    take: perPage,
                    skip: seriesSkip,
                    orderBy: { serie: { [safeSerieSortBy]: ascOrDesc } },
                },
                _count: { select: { movies: true, series: true } },
            },
        });

        if (!genre) {
            throw new NotFoundException("Genre not found");
        }

        const bookmarkInfo = userId ? await this.getBookmarkStatus(id, userId) : { isBookmarked: false };
        const dto = this.mapToDetails(genre, bookmarkInfo);

        dto.moviesPagination = {
            total: genre._count.movies,
            page: moviesPage,
            totalPages: Math.ceil(genre._count.movies / perPage),
            perPage,
        };
        dto.seriesPagination = {
            total: genre._count.series,
            page: seriesPage,
            totalPages: Math.ceil(genre._count.series / perPage),
            perPage,
        };

        return dto;
    }

    async search(name: string, userId?: number, page: number = 1, perPage: number = 20): Promise<GenreListResponseDto> {
        const skip = (page - 1) * perPage;

        const genres = await this.prisma.genre.findMany({
            where: { name: { contains: name.toLowerCase() } },
            skip,
            take: perPage,
        });

        const genresWithDetails = await Promise.all(
            genres.map(async (genre) => {
                const bookmarkInfo = userId ? await this.getBookmarkStatus(genre.id, userId) : { isBookmarked: false };
                return this.mapToDetails(genre, bookmarkInfo);
            }),
        );

        const count = await this.prisma.genre.count({
            where: { name: { contains: name.toLowerCase() } },
        });

        return { genres: genresWithDetails, count };
    }

    async create(createGenreDto: CreateGenreDto): Promise<GenreDetailsDto> {
        const genre = await this.prisma.genre.create({
            data: {
                name: createGenreDto.name.toLowerCase(),
            },
        });

        return genre as GenreDetailsDto;
    }

    async update(id: number, updateGenreDto: UpdateGenreDto): Promise<GenreDetailsDto> {
        const genre = await this.prisma.genre.findFirst({
            where: { id },
        });

        if (!genre) {
            throw new NotFoundException("Genre not found");
        }

        const updatedGenre = await this.prisma.genre.update({
            where: { id },
            data: {
                ...(updateGenreDto.name && { name: updateGenreDto.name.toLowerCase() }),
            },
        });

        return updatedGenre as GenreDetailsDto;
    }

    async remove(id: number): Promise<void> {
        const genre = await this.prisma.genre.findFirst({
            where: { id },
        });

        if (!genre) {
            throw new NotFoundException("Genre not found");
        }

        await this.prisma.genre.delete({
            where: { id },
        });
    }

    async count(): Promise<number> {
        return this.prisma.genre.count();
    }

    private async getBookmarkStatus(genreId: number, userId: number) {
        const existingFavorite = await this.prisma.userGenreFavorite.findFirst({
            where: {
                AND: [{ userId }, { genreId }],
            },
        });

        return { isBookmarked: !!existingFavorite };
    }

    private mapToDetails(genre: any, bookmarkInfo?: { isBookmarked: boolean }): GenreDetailsDto {
        const dto: GenreDetailsDto = {
            id: genre.id,
            name: genre.name,
            ...(bookmarkInfo !== undefined && { isBookmarked: bookmarkInfo.isBookmarked }),
        };

        if (genre._count) {
            dto._count = { movies: genre._count.movies, series: genre._count.series };
        }

        if (genre.movies) {
            dto.movies = genre.movies.map((gm: any) => ({
                id: gm.movie.id,
                title: gm.movie.title,
                photoSrc: gm.movie.photoSrc ?? null,
                releaseYear: gm.movie.dateAired ? new Date(gm.movie.dateAired).getFullYear() : null,
                ratingImdb: gm.movie.ratingImdb ?? null,
            }));
        }

        if (genre.series) {
            dto.series = genre.series.map((gs: any) => ({
                id: gs.serie.id,
                title: gs.serie.title,
                photoSrc: gs.serie.photoSrc ?? null,
                releaseYear: gs.serie.dateAired ? new Date(gs.serie.dateAired).getFullYear() : null,
                ratingImdb: gs.serie.ratingImdb ?? null,
            }));
        }

        return dto;
    }
}
