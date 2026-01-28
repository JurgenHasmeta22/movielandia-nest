import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
}

export class GenreQueryDto {
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
        default: 20,
        minimum: 1,
        maximum: 100,
        example: 20,
    })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    perPage?: number = 20;

    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: "Sort genres by field",
        example: "name",
        enum: ["name"],
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
}
