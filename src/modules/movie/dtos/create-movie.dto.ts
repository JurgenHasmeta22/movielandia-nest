import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateMovieDto {
    @ApiProperty({ description: "Movie title" })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiProperty({ description: "Movie description" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: "Movie duration in minutes" })
    @IsNumber()
    @IsNotEmpty()
    duration: number;

    @ApiProperty({ description: "Movie release date" })
    @IsDate()
    @IsNotEmpty()
    dateAired: Date;

    @ApiProperty({ description: "Movie poster image URL" })
    @IsString()
    @IsNotEmpty()
    photoSrc: string;

    @ApiProperty({ description: "Movie production poster image URL" })
    @IsString()
    @IsNotEmpty()
    photoSrcProd: string;

    @ApiProperty({ description: "Movie trailer URL" })
    @IsString()
    @IsNotEmpty()
    trailerSrc: string;

    @ApiProperty({ description: "IMDB rating" })
    @IsNumber()
    @IsNotEmpty()
    ratingImdb: number;
}
