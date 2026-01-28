import { IsString, IsInt, IsBoolean, IsOptional, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ForumCategoryDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "General Discussion" })
    name: string;

    @ApiProperty({ example: "General forum discussions" })
    description: string;

    @ApiProperty({ example: 0 })
    order: number;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ example: "general-discussion" })
    slug: string;

    @ApiProperty({ example: 10 })
    topicCount: number;

    @ApiProperty({ example: 50 })
    postCount: number;

    @ApiProperty({ example: "2024-01-28T10:00:00Z", required: false })
    lastPostAt?: Date;

    @ApiProperty({ example: "2024-01-28T10:00:00Z" })
    createdAt: Date;

    @ApiProperty({ example: "2024-01-28T10:00:00Z" })
    updatedAt: Date;
}

export class CreateForumCategoryDto {
    @ApiProperty({ example: "General Discussion" })
    @IsString()
    name: string;

    @ApiProperty({ example: "General forum discussions" })
    @IsString()
    description: string;

    @ApiProperty({ example: 0 })
    @IsInt()
    @IsOptional()
    order?: number;

    @ApiProperty({ example: "general-discussion" })
    @IsString()
    slug: string;
}

export class UpdateForumCategoryDto {
    @ApiProperty({ example: "General Discussion", required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: "General forum discussions", required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 0, required: false })
    @IsInt()
    @IsOptional()
    order?: number;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
