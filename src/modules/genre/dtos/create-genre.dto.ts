import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";

export class CreateGenreDto {
    @ApiProperty({
        description: "Genre name",
        example: "Action",
        minLength: 1,
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(50)
    name: string;
}
