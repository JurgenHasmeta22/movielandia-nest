import { Genre } from "@prisma/client";
import { GenreListResponseDto, GenreDetailsDto } from "./dtos/genre-response.dto";

export class GenreMapper {
    static toDto(genre: Genre): GenreDetailsDto {
        return {
            id: genre.id,
            name: genre.name,
        };
    }

    static toDtoWithDetails(genre: Genre, bookmarkInfo?: { isBookmarked: boolean }): GenreDetailsDto {
        return {
            ...this.toDto(genre),
        };
    }

    static toListResponseDto(data: { genres: GenreDetailsDto[]; count: number }): GenreListResponseDto {
        return {
            genres: data.genres,
            count: data.count,
        };
    }
}
