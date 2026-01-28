import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { GenreQueryDto } from "./dtos/genre-query.dto";
import { CreateGenreDto } from "./dtos/create-genre.dto";
import { UpdateGenreDto } from "./dtos/update-genre.dto";
import { GenreListResponseDto, GenreDetailsDto } from "./dtos/genre-response.dto";
import { GenreMapper } from "./genre.mapper";
import { GenreParser } from "./genre.parser";

@Injectable()
export class GenreService {
    constructor(private prisma: PrismaService) {}

    async findAll(query: GenreQueryDto, userId?: number): Promise<GenreListResponseDto> {
        try {
            const { filters, orderByObject, skip, take } = GenreParser.parseGenreQuery(query);

            const genres = await this.prisma.genre.findMany({
                where: filters,
                orderBy: orderByObject,
                skip,
                take,
            });

            const genresWithDetails = await Promise.all(
                genres.map(async (genre) => {
                    const bookmarkInfo = userId
                        ? await this.getBookmarkStatus(genre.id, userId)
                        : { isBookmarked: false };
                    return GenreMapper.toDtoWithDetails(genre, bookmarkInfo);
                }),
            );

            const totalCount = await this.prisma.genre.count({ where: filters });

            return GenreMapper.toListResponseDto({ genres: genresWithDetails, count: totalCount });
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

    async findOne(id: number, userId?: number): Promise<GenreDetailsDto> {
        const genre = await this.prisma.genre.findFirst({
            where: { id },
        });

        if (!genre) {
            throw new NotFoundException("Genre not found");
        }

        const bookmarkInfo = userId ? await this.getBookmarkStatus(id, userId) : { isBookmarked: false };
        return GenreMapper.toDtoWithDetails(genre, bookmarkInfo);
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
                const bookmarkInfo = userId
                    ? await this.getBookmarkStatus(genre.id, userId)
                    : { isBookmarked: false };
                return GenreMapper.toDtoWithDetails(genre, bookmarkInfo);
            }),
        );

        const count = await this.prisma.genre.count({
            where: { name: { contains: name.toLowerCase() } },
        });

        return GenreMapper.toListResponseDto({ genres: genresWithDetails, count });
    }

    async create(createGenreDto: CreateGenreDto): Promise<GenreDetailsDto> {
        const genre = await this.prisma.genre.create({
            data: {
                name: createGenreDto.name.toLowerCase(),
            },
        });

        return GenreMapper.toDto(genre);
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

        return GenreMapper.toDto(updatedGenre);
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
}
