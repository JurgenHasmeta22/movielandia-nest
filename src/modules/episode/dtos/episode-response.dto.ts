import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class EpisodeRatingInfo {
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

export class EpisodeDetailsDto {
    @ApiProperty({
        example: 1,
        description: "Unique identifier of the episode",
    })
    id: number;

    @ApiProperty({
        example: "Pilot",
        description: "Episode title",
    })
    title: string;

    @ApiProperty({
        example: "The first episode of the season",
        description: "Episode description",
    })
    description: string;

    @ApiProperty({
        example: "https://example.com/episode1-poster.jpg",
        description: "Episode poster URL",
    })
    photoSrc: string;

    @ApiProperty({
        example: "https://example.com/episode1-production.jpg",
        description: "Episode production image URL",
    })
    photoSrcProd: string;

    @ApiProperty({
        example: "https://example.com/trailers/episode1.mp4",
        description: "Episode trailer URL",
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
        description: "Episode air date",
    })
    dateAired: Date;

    @ApiProperty({
        example: 45,
        description: "Episode duration in minutes",
    })
    duration: number;

    @ApiProperty({
        example: 1,
        description: "Season ID",
    })
    seasonId: number;

    @ApiProperty({
        type: EpisodeRatingInfo,
        description: "User ratings information",
        required: false,
    })
    @Type(() => EpisodeRatingInfo)
    ratings?: EpisodeRatingInfo;

    @ApiProperty({
        example: false,
        description: "Whether the episode is bookmarked by current user",
        required: false,
    })
    isBookmarked?: boolean;

    @ApiProperty({
        example: false,
        description: "Whether the episode has been reviewed by current user",
        required: false,
    })
    isReviewed?: boolean;

    @ApiProperty({
        description: "List of reviews for this episode",
        isArray: true,
        required: false,
    })
    reviews?: any[];
}

export class EpisodeListResponseDto {
    @ApiProperty({
        type: [EpisodeDetailsDto],
        description: "Array of episodes",
    })
    episodes: EpisodeDetailsDto[];

    @ApiProperty({
        example: 50,
        description: "Total count of episodes matching the query",
    })
    count: number;
}
