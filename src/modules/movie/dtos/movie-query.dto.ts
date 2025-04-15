import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
}

export class MovieQueryDto {
    @ApiPropertyOptional({ 
        description: "Page number for pagination",
        default: 1,
        minimum: 1,
        example: 1
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
        example: 12
    })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    perPage?: number = 12;

    @ApiPropertyOptional({ 
        description: "Filter movies by title",
        example: "Dark Knight"
    })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({ 
        description: "Sort movies by field",
        example: "ratingImdb",
        enum: ["title", "dateAired", "ratingImdb", "duration"]
    })
    @IsString()
    @IsOptional()
    sortBy?: string;

    @ApiPropertyOptional({ 
        description: "Sort order",
        enum: SortOrder,
        default: SortOrder.ASC,
        example: SortOrder.DESC
    })
    @IsEnum(SortOrder)
    @IsOptional()
    ascOrDesc?: SortOrder = SortOrder.ASC;

    @ApiPropertyOptional({ 
        description: "Filter value for advanced filtering",
        example: "8.5",
        oneOf: [
            { type: 'number' },
            { type: 'string' }
        ]
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    filterValue?: number | string;

    @ApiPropertyOptional({ 
        description: "Field name to filter on",
        example: "ratingImdb",
        enum: ["ratingImdb", "duration", "dateAired"]
    })
    @IsString()
    @IsOptional()
    filterNameString?: string;

    @ApiPropertyOptional({ 
        description: "Filter operator",
        example: ">",
        enum: [">", "<", "=", "contains"]
    })
    @IsString()
    @IsOptional()
    filterOperatorString?: string;
}
