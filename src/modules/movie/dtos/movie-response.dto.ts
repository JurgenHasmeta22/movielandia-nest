import { ApiProperty } from "@nestjs/swagger";
import { Movie } from "@prisma/client";
import { Type } from "class-transformer";

export class MovieRatingInfo {
    @ApiProperty()
    averageRating: number;

    @ApiProperty()
    totalReviews: number;
}

export class MovieDetailsDto extends Movie {
    @ApiProperty()
    @Type(() => MovieRatingInfo)
    ratings?: MovieRatingInfo;

    @ApiProperty()
    isBookmarked?: boolean;

    @ApiProperty()
    isReviewed?: boolean;
}

export class MovieListResponseDto {
    @ApiProperty({ type: [MovieDetailsDto] })
    @Type(() => MovieDetailsDto)
    movies: MovieDetailsDto[];

    @ApiProperty()
    count?: number;
}

export class RelatedMoviesResponseDto {
    @ApiProperty({ type: [MovieDetailsDto], nullable: true })
    @Type(() => MovieDetailsDto)
    movies: MovieDetailsDto[] | null;

    @ApiProperty()
    count: number;
}
