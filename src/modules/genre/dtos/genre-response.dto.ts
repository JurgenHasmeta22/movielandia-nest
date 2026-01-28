import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class GenreDetailsDto {
    @ApiProperty({
        example: 1,
        description: "Unique identifier of the genre",
    })
    id: number;

    @ApiProperty({
        example: "Action",
        description: "Genre name",
    })
    name: string;
}

export class GenreListResponseDto {
    @ApiProperty({
        type: [GenreDetailsDto],
        description: "List of genres matching the query",
    })
    @Type(() => GenreDetailsDto)
    genres: GenreDetailsDto[];

    @ApiProperty({
        example: 15,
        description: "Total number of genres matching the query",
    })
    count?: number;
}
