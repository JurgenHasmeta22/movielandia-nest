import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class SerieRatingInfo {
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

export class SerieDetailsDto {
    @ApiProperty({
        example: 1,
        description: "Unique identifier of the serie",
    })
    id: number;

    @ApiProperty({
        example: "Breaking Bad",
        description: "Serie title",
    })
    title: string;

    @ApiProperty({
        example:
            "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing methamphetamine with a former student to secure his family's financial future.",
        description: "Serie description",
    })
    description: string;

    @ApiProperty({
        example: "https://example.com/breaking-bad-poster.jpg",
        description: "Serie poster URL",
    })
    photoSrc: string;

    @ApiProperty({
        example: "https://example.com/breaking-bad-production.jpg",
        description: "Serie production image URL",
    })
    photoSrcProd: string;

    @ApiProperty({
        example: "https://example.com/trailers/breaking-bad.mp4",
        description: "Serie trailer URL",
    })
    trailerSrc: string;

    @ApiProperty({
        example: 9.5,
        description: "IMDB rating",
        minimum: 0,
        maximum: 10,
    })
    ratingImdb: number;

    @ApiProperty({
        example: "2008-01-20T00:00:00.000Z",
        description: "Serie release date",
    })
    dateAired: Date;

    @ApiProperty({
        type: SerieRatingInfo,
        description: "User ratings information",
    })
    @Type(() => SerieRatingInfo)
    ratings?: SerieRatingInfo;

    @ApiProperty({
        example: true,
        description: "Whether the current user has bookmarked this serie",
    })
    isBookmarked?: boolean;

    @ApiProperty({
        example: false,
        description: "Whether the current user has reviewed this serie",
    })
    isReviewed?: boolean;
}

export class SerieListResponseDto {
    @ApiProperty({
        type: [SerieDetailsDto],
        description: "List of series matching the query",
    })
    @Type(() => SerieDetailsDto)
    series: SerieDetailsDto[];

    @ApiProperty({
        example: 42,
        description: "Total number of series matching the query",
    })
    count?: number;
}

export class RelatedSeriesResponseDto {
    @ApiProperty({
        type: [SerieDetailsDto],
        nullable: true,
        description: "List of series related to a specific serie",
    })
    @Type(() => SerieDetailsDto)
    series: SerieDetailsDto[] | null;

    @ApiProperty({
        example: 5,
        description: "Total number of related series",
    })
    count: number;
}
