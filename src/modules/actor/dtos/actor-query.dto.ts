import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
}

export class ActorQueryDto {
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
    fullname?: string;

    @ApiPropertyOptional({
        description: "Sort actors by field",
        example: "fullname",
        enum: ["fullname", "debut"],
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
