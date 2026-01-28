import { IsInt, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ListItemDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Great movie!", required: false })
    note?: string;

    @ApiProperty({ example: 0 })
    orderIndex: number;

    @ApiProperty({ example: "2024-01-28T10:00:00Z" })
    addedAt: Date;
}

export class AddListItemDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    contentId: number;

    @ApiProperty({ example: "Great movie!", required: false })
    @IsString()
    @IsOptional()
    note?: string;
}

export class UpdateListItemDto {
    @ApiProperty({ example: "Updated note", required: false })
    @IsString()
    @IsOptional()
    note?: string;

    @ApiProperty({ example: 0, required: false })
    @IsInt()
    @IsOptional()
    orderIndex?: number;
}
