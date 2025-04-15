import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateMovieDto {
    @ApiProperty({ 
        description: "Movie title",
        example: "The Dark Knight",
        minLength: 1,
        maxLength: 255 
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiProperty({ 
        description: "Movie description",
        example: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice." 
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ 
        description: "Movie duration in minutes",
        example: 152,
        minimum: 1 
    })
    @IsNumber()
    @IsNotEmpty()
    duration: number;

    @ApiProperty({ 
        description: "Movie release date",
        example: "2008-07-18T00:00:00.000Z" 
    })
    @IsDate()
    @IsNotEmpty()
    dateAired: Date;

    @ApiProperty({ 
        description: "Movie poster image URL",
        example: "https://example.com/dark-knight-poster.jpg" 
    })
    @IsString()
    @IsNotEmpty()
    photoSrc: string;

    @ApiProperty({ 
        description: "Movie production poster image URL",
        example: "https://example.com/dark-knight-production.jpg" 
    })
    @IsString()
    @IsNotEmpty()
    photoSrcProd: string;

    @ApiProperty({ 
        description: "Movie trailer URL",
        example: "https://example.com/trailers/dark-knight.mp4" 
    })
    @IsString()
    @IsNotEmpty()
    trailerSrc: string;

    @ApiProperty({ 
        description: "IMDB rating",
        example: 9.0,
        minimum: 0,
        maximum: 10 
    })
    @IsNumber()
    @IsNotEmpty()
    ratingImdb: number;
}
