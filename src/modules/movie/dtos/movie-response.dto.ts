import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class MovieRatingInfo {
    @ApiProperty({
        description: "Average user rating",
        example: 4.5,
        minimum: 0,
        maximum: 5
    })
    averageRating: number;

    @ApiProperty({
        description: "Total number of user reviews",
        example: 127
    })
    totalReviews: number;
}

export class MovieDetailsDto {
    @ApiProperty({
        example: 1,
        description: "Unique identifier of the movie"
    })
    id: number;

    @ApiProperty({
        example: "The Dark Knight",
        description: "Movie title"
    })
    title: string;

    @ApiProperty({
        example: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        description: "Movie description"
    })
    description: string;

    @ApiProperty({
        example: "https://example.com/dark-knight-poster.jpg",
        description: "Movie poster URL"
    })
    photoSrc: string;

    @ApiProperty({
        example: "https://example.com/dark-knight-production.jpg",
        description: "Movie production image URL"
    })
    photoSrcProd: string;

    @ApiProperty({
        example: "https://example.com/trailers/dark-knight.mp4",
        description: "Movie trailer URL"
    })
    trailerSrc: string;

    @ApiProperty({
        example: 152,
        description: "Movie duration in minutes"
    })
    duration: number;

    @ApiProperty({
        example: 9.0,
        description: "IMDB rating",
        minimum: 0,
        maximum: 10
    })
    ratingImdb: number;

    @ApiProperty({
        example: "2008-07-18T00:00:00.000Z",
        description: "Movie release date"
    })
    dateAired: Date;

    @ApiProperty({ 
        type: MovieRatingInfo,
        description: "User ratings information"
    })
    @Type(() => MovieRatingInfo)
    ratings?: MovieRatingInfo;

    @ApiProperty({
        example: true,
        description: "Whether the current user has bookmarked this movie"
    })
    isBookmarked?: boolean;

    @ApiProperty({
        example: false,
        description: "Whether the current user has reviewed this movie"
    })
    isReviewed?: boolean;
}

export class MovieListResponseDto {
    @ApiProperty({ 
        type: [MovieDetailsDto],
        description: "List of movies matching the query"
    })
    @Type(() => MovieDetailsDto)
    movies: MovieDetailsDto[];

    @ApiProperty({
        example: 42,
        description: "Total number of movies matching the query"
    })
    count?: number;
}

export class RelatedMoviesResponseDto {
    @ApiProperty({ 
        type: [MovieDetailsDto], 
        nullable: true,
        description: "List of movies related to a specific movie"
    })
    @Type(() => MovieDetailsDto)
    movies: MovieDetailsDto[] | null;

    @ApiProperty({
        example: 5,
        description: "Total number of related movies"
    })
    count: number;
}
