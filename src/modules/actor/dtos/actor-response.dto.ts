import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class ActorRatingInfo {
    @ApiProperty({
        description: "Average user rating",
        example: 4.5,
        minimum: 0,
        maximum: 5,
    })
    averageRating: number;

    @ApiProperty({
        description: "Total number of user reviews",
        example: 45,
    })
    totalReviews: number;
}

export class ActorDetailsDto {
    @ApiProperty({
        example: 1,
        description: "Unique identifier of the actor",
    })
    id: number;

    @ApiProperty({
        example: "Leonardo DiCaprio",
        description: "Actor full name",
    })
    fullname: string;

    @ApiProperty({
        example: "https://example.com/actor-photo.jpg",
        description: "Actor photo URL",
    })
    photoSrc: string;

    @ApiProperty({
        example: "https://example.com/actor-photo-prod.jpg",
        description: "Actor production photo URL",
    })
    photoSrcProd: string;

    @ApiProperty({
        example: "American actor and producer, known for films like Inception, The Great Gatsby, etc.",
        description: "Actor description",
    })
    description: string;

    @ApiProperty({
        example: "1991",
        description: "Actor debut date",
    })
    debut: string;

    @ApiProperty({
        type: ActorRatingInfo,
        description: "User ratings information",
    })
    @Type(() => ActorRatingInfo)
    ratings?: ActorRatingInfo;

    @ApiProperty({
        example: true,
        description: "Whether the current user has bookmarked this actor",
    })
    isBookmarked?: boolean;

    @ApiProperty({
        example: false,
        description: "Whether the current user has reviewed this actor",
    })
    isReviewed?: boolean;
}

export class ActorListResponseDto {
    @ApiProperty({
        type: [ActorDetailsDto],
        description: "List of actors matching the query",
    })
    @Type(() => ActorDetailsDto)
    actors: ActorDetailsDto[];

    @ApiProperty({
        example: 42,
        description: "Total number of actors matching the query",
    })
    count?: number;
}
