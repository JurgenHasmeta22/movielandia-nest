import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
}

export class MovieQueryDto {
    @ApiPropertyOptional({ default: 1 })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    page?: number = 1;

    @ApiPropertyOptional({ default: 12 })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    perPage?: number = 12;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    sortBy?: string;

    @ApiPropertyOptional({ enum: SortOrder })
    @IsEnum(SortOrder)
    @IsOptional()
    ascOrDesc?: SortOrder = SortOrder.ASC;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    filterValue?: number | string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    filterNameString?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    filterOperatorString?: string;
}
