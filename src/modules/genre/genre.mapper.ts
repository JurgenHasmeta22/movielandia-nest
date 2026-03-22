import { Genre } from "@prisma/client";
import { GenreListResponseDto, GenreDetailsDto } from "./dtos/genre-response.dto";

export class GenreMapper {
    static toDto(genre: Genre): GenreDetailsDto {
        return {
            id: genre.id,
            name: genre.name,
        };
    }

    static toDtoWithDetails(genre: any, bookmarkInfo?: { isBookmarked: boolean }): GenreDetailsDto {
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

    static toListResponseDto(data: { genres: GenreDetailsDto[]; count: number }): GenreListResponseDto {
        return {
            genres: data.genres,
            count: data.count,
        };
    }
}
