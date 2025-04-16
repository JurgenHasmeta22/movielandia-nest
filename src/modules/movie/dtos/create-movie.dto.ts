import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    IsInt,
    IsOptional,
    IsUrl,
    Validate,
    IsISO8601,
    IsNumber,
    Min,
    Max,
} from "class-validator";
import { Type } from "class-transformer";
import { isValidDuration, validateImageUrl } from "../../../utils/validation.util";

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
        description: "Movie poster image URL",
        example: "https://example.com/dark-knight-poster.jpg",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @Validate((value: string) => validateImageUrl(value), {
        message: "Invalid image URL. Must end with jpg, jpeg, png, webp, or avif",
    })
    photoSrc: string;

    @ApiProperty({
        description: "Movie production poster image URL",
        example: "https://example.com/dark-knight-production.jpg",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @Validate((value: string) => validateImageUrl(value), {
        message: "Invalid image URL. Must end with jpg, jpeg, png, webp, or avif",
    })
    photoSrcProd: string;

    @ApiProperty({
        description: "Movie trailer URL",
        example: "https://example.com/dark-knight-trailer.mp4",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    trailerSrc: string;

    @ApiProperty({
        description: "Movie description",
        example:
            "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: "Movie duration in minutes",
        example: 152,
        minimum: 1,
    })
    @IsInt()
    @Type(() => Number)
    @Validate((value: number) => isValidDuration(value), {
        message: "Duration must be between 1 and 999 minutes",
    })
    duration: number;

    @ApiProperty({
        description: "IMDB rating",
        example: 9.0,
        minimum: 0,
        maximum: 10,
    })
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    @Max(10)
    ratingImdb: number;

    @ApiProperty({
        description: "Movie release date",
        example: "2008-07-18T00:00:00.000Z",
    })
    @IsOptional()
    @IsISO8601()
    dateAired?: string;
}
