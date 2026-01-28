import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class SeasonRatingInfo {
    @ApiProperty({
        description: "Average user rating",
        example: 4.5,
        minimum: 0,
        maximum: 5,
    })
    averageRating: number;

    @ApiProperty({
        description: "Total number of user reviews",
        example: 127,
    })
    totalReviews: number;
}

export class SeasonDetailsDto {
    @ApiProperty({
        example: 1,
        description: "Unique identifier of the season",
    })
    id: number;

    @ApiProperty({
        example: "Season 1",
        description: "Season title",
    })
    title: string;

    @ApiProperty({
        example: "The first season of the series",
        description: "Season description",
    })
    description: string;

    @ApiProperty({
        example: "https://example.com/season1-poster.jpg",
        description: "Season poster URL",
    })
    photoSrc: string;

    @ApiProperty({
        example: "https://example.com/season1-production.jpg",
        description: "Season production image URL",
    })
    photoSrcProd: string;

    @ApiProperty({
        example: "https://example.com/trailers/season1.mp4",
        description: "Season trailer URL",
    })
    trailerSrc: string;

    @ApiProperty({
        example: 8.5,
        description: "IMDB rating",
        minimum: 0,
        maximum: 10,
    })
    ratingImdb: number;

    @ApiProperty({
        example: "2020-01-01T00:00:00.000Z",
        description: "Season air date",
    })
    dateAired: Date;

    @ApiProperty({
        example: 1,
        description: "Serie ID",
    })
    serieId: number;

    @ApiProperty({
        type: SeasonRatingInfo,
        description: "User ratings information",
        required: false,
    })
    @Type(() => SeasonRatingInfo)
    ratings?: SeasonRatingInfo;

    @ApiProperty({
        example: false,
        description: "Whether the season is bookmarked by current user",
        required: false,
    })
    isBookmarked?: boolean;

    @ApiProperty({
        example: false,
        description: "Whether the season has been reviewed by current user",
        required: false,
    })
    isReviewed?: boolean;
}

export class SeasonListResponseDto {
    @ApiProperty({
        type: [SeasonDetailsDto],
        description: "Array of seasons",
    })
    seasons: SeasonDetailsDto[];

    @ApiProperty({
        example: 50,
        description: "Total count of seasons matching the query",
    })
    count: number;
}
