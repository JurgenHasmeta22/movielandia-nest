import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    IsOptional,
    IsUrl,
    Validate,
    IsISO8601,
    IsNumber,
    Min,
    Max,
} from "class-validator";
import { Type } from "class-transformer";
import { validateImageUrl } from "../../../utils/validation.util";

export class CreateSerieDto {
    @ApiProperty({
        description: "Serie title",
        example: "Breaking Bad",
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiProperty({
        description: "Serie poster image URL",
        example: "https://example.com/breaking-bad-poster.jpg",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @Validate((value: string) => validateImageUrl(value), {
        message: "Invalid image URL. Must end with jpg, jpeg, png, webp, or avif",
    })
    photoSrc: string;

    @ApiProperty({
        description: "Serie production poster image URL",
        example: "https://example.com/breaking-bad-production.jpg",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @Validate((value: string) => validateImageUrl(value), {
        message: "Invalid image URL. Must end with jpg, jpeg, png, webp, or avif",
    })
    photoSrcProd: string;

    @ApiProperty({
        description: "Serie trailer URL",
        example: "https://example.com/breaking-bad-trailer.mp4",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    trailerSrc: string;

    @ApiProperty({
        description: "Serie description",
        example:
            "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing methamphetamine with a former student to secure his family's financial future.",
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: "IMDB rating",
        example: 9.5,
        minimum: 0,
        maximum: 10,
    })
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    @Max(10)
    ratingImdb: number;

    @ApiProperty({
        description: "Serie release date",
        example: "2008-01-20T00:00:00.000Z",
    })
    @IsOptional()
    @IsISO8601()
    dateAired?: string;
}
