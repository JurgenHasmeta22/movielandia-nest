import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CrewRatingInfo {
    @ApiProperty({
        description: "Average user rating",
        example: 4.5,
        minimum: 0,
        maximum: 5,
    })
    averageRating: number;

    @ApiProperty({
        description: "Total number of user reviews",
        example: 62,
    })
    totalReviews: number;
}

export class CrewDetailsDto {
    @ApiProperty({
        example: 1,
        description: "Unique identifier of the crew member",
    })
    id: number;

    @ApiProperty({
        example: "Christopher Nolan",
        description: "Crew member full name",
    })
    fullname: string;

    @ApiProperty({
        example: "Director",
        description: "Crew member role",
    })
    role: string;

    @ApiProperty({
        example: "https://example.com/crew-photo.jpg",
        description: "Crew member photo URL",
    })
    photoSrc: string;

    @ApiProperty({
        example: "https://example.com/crew-photo-prod.jpg",
        description: "Crew member production photo URL",
    })
    photoSrcProd: string;

    @ApiProperty({
        example: "British film and television director, known for films like Inception, Interstellar, etc.",
        description: "Crew member description",
    })
    description: string;

    @ApiProperty({
        example: "1998",
        description: "Crew member debut date",
    })
    debut: string;

    @ApiProperty({
        type: CrewRatingInfo,
        description: "User ratings information",
    })
    @Type(() => CrewRatingInfo)
    ratings?: CrewRatingInfo;

    @ApiProperty({
        example: true,
        description: "Whether the current user has bookmarked this crew member",
    })
    isBookmarked?: boolean;

    @ApiProperty({
        example: false,
        description: "Whether the current user has reviewed this crew member",
    })
    isReviewed?: boolean;

    @ApiProperty({
        description: "List of reviews for this crew member",
        isArray: true,
        required: false,
    })
    reviews?: any[];
}

export class CrewListResponseDto {
    @ApiProperty({
        type: [CrewDetailsDto],
        description: "List of crew members matching the query",
    })
    @Type(() => CrewDetailsDto)
    crew: CrewDetailsDto[];

    @ApiProperty({
        example: 42,
        description: "Total number of crew members matching the query",
    })
    count?: number;
}
