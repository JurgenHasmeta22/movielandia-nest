import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, IsBoolean } from "class-validator";

export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
}

export class ListQueryDto {
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

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === "true" || value === true)
    isPrivate?: boolean;

    @ApiPropertyOptional({
        description: "Sort lists by field",
        example: "createdAt",
        enum: ["createdAt", "title", "updatedAt"],
    })
    @IsString()
    @IsOptional()
    sortBy?: string;

    @ApiPropertyOptional({
        description: "Sort order",
        enum: SortOrder,
        default: SortOrder.ASC,
    })
    @IsEnum(SortOrder)
    @IsOptional()
    ascOrDesc?: SortOrder;
}
