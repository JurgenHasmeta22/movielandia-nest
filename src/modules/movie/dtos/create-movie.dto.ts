import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

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
    @IsUrl()
    @IsNotEmpty()
    posterImage: string;

    @ApiPropertyOptional({ description: "Movie background image URL" })
    @IsUrl()
    @IsOptional()
    backgroundImage?: string;

    @ApiProperty({ description: "Movie trailer URL" })
    @IsUrl()
    @IsNotEmpty()
    trailerUrl: string;

    @ApiProperty({ description: "IMDB rating" })
    @IsNumber()
    @IsNotEmpty()
    imdbRating: number;
}
