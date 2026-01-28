import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength, IsUrl, Validate } from "class-validator";
import { validateImageUrl } from "../../../utils/validation.util";

export class CreateCrewDto {
    @ApiProperty({
        description: "Crew member full name",
        example: "Christopher Nolan",
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    fullname: string;

    @ApiProperty({
        description: "Crew member role",
        example: "Director",
    })
    @IsString()
    @IsNotEmpty()
    role: string;

    @ApiProperty({
        description: "Crew member photo URL",
        example: "https://example.com/crew-photo.jpg",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @Validate((value: string) => validateImageUrl(value), {
        message: "Invalid image URL. Must end with jpg, jpeg, png, webp, or avif",
    })
    photoSrc: string;

    @ApiProperty({
        description: "Crew member production photo URL",
        example: "https://example.com/crew-photo-prod.jpg",
    })
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @Validate((value: string) => validateImageUrl(value), {
        message: "Invalid image URL. Must end with jpg, jpeg, png, webp, or avif",
    })
    photoSrcProd: string;

    @ApiProperty({
        description: "Crew member description",
        example: "British film and television director, known for films like Inception, Interstellar, etc.",
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: "Crew member debut date",
        example: "1998",
    })
    @IsString()
    @IsNotEmpty()
    debut: string;
}
