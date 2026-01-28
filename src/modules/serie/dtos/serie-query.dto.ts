import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
}

export class SerieQueryDto {
    @ApiPropertyOptional({
        description: "Page number for pagination",
        default: 1,
        minimum: 1,
        example: 1,
    })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    page?: number = 1;

    @ApiPropertyOptional({
        description: "Number of items per page",
        default: 12,
        minimum: 1,
        maximum: 50,
        example: 12,
    })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    perPage?: number = 12;

    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({
        description: "Sort series by field",
        example: "title",
        enum: ["title", "dateAired", "ratingImdb"],
    })
    @IsString()
    @IsOptional()
    sortBy?: string;

    @ApiPropertyOptional({
        description: "Sort order",
        enum: SortOrder,
        default: SortOrder.ASC,
        example: SortOrder.DESC,
    })
    @IsEnum(SortOrder)
    @IsOptional()
    ascOrDesc?: SortOrder = SortOrder.ASC;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    filterValue?: number | string;

    @IsString()
    @IsOptional()
    filterNameString?: string;

    @IsString()
    @IsOptional()
    filterOperatorString?: string;
}
