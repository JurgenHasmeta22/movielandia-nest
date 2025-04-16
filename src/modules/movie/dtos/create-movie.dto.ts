import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
    IsInt,
    IsOptional,
    IsArray,
    IsUrl,
    Validate,
} from "class-validator";
import { isValidYear, isValidDuration, isValidRating, validateImageUrl } from "../../../utils/validation.util";

export class CreateMovieDto {
    @ApiProperty({
        description: "Movie title",
        example: "The Dark Knight",
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiProperty({
        description: "Movie description",
        example:
            "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: "Movie release year",
        example: 2008,
    })
    @IsInt()
    @Validate((value: number) => isValidYear(value), {
        message: "Invalid release year",
    })
    releaseYear: number;

    @ApiProperty({
        description: "Movie duration in minutes",
        example: 152,
        minimum: 1,
    })
    @IsInt()
    @Validate((value: number) => isValidDuration(value), {
        message: "Duration must be between 1 and 999 minutes",
    })
    duration: number;

    @ApiProperty({
        description: "Movie poster image URL",
        example: "https://example.com/dark-knight-poster.jpg",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @Validate((value: string) => validateImageUrl(value), {
        message: "Invalid image URL. Must end with jpg, jpeg, png, webp, or avif",
    })
    posterUrl: string;

    @ApiPropertyOptional({
        description: "Movie production poster image URL",
        example: "https://example.com/dark-knight-production.jpg",
    })
    @IsString()
    @IsUrl()
    @IsOptional()
    @Validate((value: string) => validateImageUrl(value), {
        message: "Invalid image URL. Must end with jpg, jpeg, png, webp, or avif",
    })
    backdropUrl?: string;

    @ApiProperty({
        description: "Genre IDs",
        example: [1, 2, 3],
    })
    @IsArray()
    @IsInt({ each: true })
    genreIds: number[];

    @ApiPropertyOptional({
        description: "IMDB rating",
        example: 9.0,
        minimum: 0,
        maximum: 10,
    })
    @IsInt()
    @Validate((value: number) => isValidRating(value), {
        message: "Rating must be between 0 and 10",
    })
    @IsOptional()
    rating?: number;
}
