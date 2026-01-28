import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    IsUrl,
    IsISO8601,
    IsNumber,
    Min,
    Max,
    IsOptional,
    Validate,
    IsInt,
} from "class-validator";
import { Type } from "class-transformer";
import { validateImageUrl } from "../../../utils/validation.util";

export class CreateEpisodeDto {
    @ApiProperty({
        description: "Episode title",
        example: "Pilot",
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiProperty({
        description: "Episode poster image URL",
        example: "https://example.com/episode1-poster.jpg",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @Validate((value: string) => validateImageUrl(value), {
        message: "Invalid image URL. Must end with jpg, jpeg, png, webp, or avif",
    })
    photoSrc: string;

    @ApiProperty({
        description: "Episode production image URL",
        example: "https://example.com/episode1-production.jpg",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @Validate((value: string) => validateImageUrl(value), {
        message: "Invalid image URL. Must end with jpg, jpeg, png, webp, or avif",
    })
    photoSrcProd: string;

    @ApiProperty({
        description: "Episode trailer URL",
        example: "https://example.com/trailers/episode1.mp4",
    })
    @IsString()
    @IsUrl()
    @IsOptional()
    trailerSrc?: string;

    @ApiProperty({
        description: "Episode description",
        example: "The first episode of the season",
        maxLength: 5000,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    description: string;

    @ApiProperty({
        description: "Episode duration in minutes",
        example: 45,
    })
    @IsNumber()
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    @Type(() => Number)
    duration: number;

    @ApiProperty({
        description: "Episode air date (ISO 8601 format)",
        example: "2020-01-01",
    })
    @IsISO8601()
    @IsOptional()
    dateAired?: string;

    @ApiProperty({
        description: "IMDB rating",
        example: 8.5,
        minimum: 0,
        maximum: 10,
    })
    @IsNumber()
    @Min(0)
    @Max(10)
    @IsNotEmpty()
    @Type(() => Number)
    ratingImdb: number;

    @ApiProperty({
        description: "Season ID",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    seasonId: number;
}
