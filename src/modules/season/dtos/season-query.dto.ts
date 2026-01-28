import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber, Min, Max, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class SeasonQueryDto {
    @ApiProperty({
        description: "Page number (1-indexed)",
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page?: number;

    @ApiProperty({
        description: "Number of items per page",
        example: 10,
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    pageSize?: number;

    @ApiProperty({
        description: "Search term for season title or description",
        example: "action",
        required: false,
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({
        description: "Serie ID to filter by",
        example: 1,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    serieId?: number;

    @ApiProperty({
        description: "Minimum IMDB rating",
        example: 5,
        required: false,
        minimum: 0,
        maximum: 10,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    @Type(() => Number)
    minRating?: number;

    @ApiProperty({
        description: "Maximum IMDB rating",
        example: 10,
        required: false,
        minimum: 0,
        maximum: 10,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    @Type(() => Number)
    maxRating?: number;

    @ApiProperty({
        description: "Sort by field (rating, date, title, or id)",
        example: "rating",
        enum: ["rating", "date", "title", "id"],
        required: false,
    })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiProperty({
        description: "Sort order",
        example: "desc",
        enum: ["asc", "desc"],
        required: false,
    })
    @IsOptional()
    @IsString()
    sortOrder?: "asc" | "desc";
}
