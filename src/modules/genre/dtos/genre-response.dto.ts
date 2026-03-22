import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class GenreMediaItemDto {
    id: number;
    title: string;
    photoSrc?: string | null;
    releaseYear?: number | null;
    ratingImdb?: number | null;
}

export class GenrePaginationDto {
    total: number;
    page: number;
    totalPages: number;
    perPage: number;
}

export class GenreDetailsDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Action" })
    name: string;

    @ApiProperty({ required: false })
    description?: string | null;

    @ApiProperty({ required: false })
    isBookmarked?: boolean;

    @ApiProperty({ required: false })
    movies?: GenreMediaItemDto[];

    @ApiProperty({ required: false })
    series?: GenreMediaItemDto[];

    @ApiProperty({ required: false })
    moviesPagination?: GenrePaginationDto;

    @ApiProperty({ required: false })
    seriesPagination?: GenrePaginationDto;

    @ApiProperty({ required: false })
    _count?: { movies: number; series: number };
}

export class GenreListResponseDto {
    @ApiProperty({ type: [GenreDetailsDto] })
    @Type(() => GenreDetailsDto)
    genres: GenreDetailsDto[];

    @ApiProperty({ example: 15 })
    count?: number;
}
