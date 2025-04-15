import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class MovieRatingInfo {
    @ApiProperty()
    averageRating: number;

    @ApiProperty()
    totalReviews: number;
}

export class MovieDetailsDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    photoSrc: string;

    @ApiProperty()
    photoSrcProd: string;

    @ApiProperty()
    trailerSrc: string;

    @ApiProperty()
    duration: number;

    @ApiProperty()
    ratingImdb: number;

    @ApiProperty()
    dateAired: Date;

    @ApiProperty({ type: MovieRatingInfo })
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
