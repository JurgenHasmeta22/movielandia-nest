import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    IsUrl,
    Validate,
} from "class-validator";
import { Type } from "class-transformer";
import { validateImageUrl } from "../../../utils/validation.util";

export class CreateActorDto {
    @ApiProperty({
        description: "Actor full name",
        example: "Leonardo DiCaprio",
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    fullname: string;

    @ApiProperty({
        description: "Actor photo URL",
        example: "https://example.com/actor-photo.jpg",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @Validate((value: string) => validateImageUrl(value), {
        message: "Invalid image URL. Must end with jpg, jpeg, png, webp, or avif",
    })
    photoSrc: string;

    @ApiProperty({
        description: "Actor production photo URL",
        example: "https://example.com/actor-photo-prod.jpg",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @Validate((value: string) => validateImageUrl(value), {
        message: "Invalid image URL. Must end with jpg, jpeg, png, webp, or avif",
    })
    photoSrcProd: string;

    @ApiProperty({
        description: "Actor description",
        example: "American actor and producer, known for films like Inception, The Great Gatsby, etc.",
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: "Actor debut date",
        example: "1991",
    })
    @IsString()
    @IsNotEmpty()
    debut: string;
}
