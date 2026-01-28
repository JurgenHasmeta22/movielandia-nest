import { IsString, IsInt, IsBoolean, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

enum TopicStatus {
    Open = "Open",
    Closed = "Closed",
    Archived = "Archived",
}

export class ForumTopicDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "How to use the forum?" })
    title: string;

    @ApiProperty({ example: "This is a detailed discussion..." })
    content: string;

    @ApiProperty({ example: false })
    isPinned: boolean;

    @ApiProperty({ example: false })
    isLocked: boolean;

    @ApiProperty({ example: "how-to-use-the-forum" })
    slug: string;

    @ApiProperty({ example: 100 })
    viewCount: number;

    @ApiProperty({ example: "Open", enum: TopicStatus })
    status: TopicStatus;

    @ApiProperty({ example: 1 })
    categoryId: number;

    @ApiProperty({ example: 1 })
    userId: number;

    @ApiProperty({ example: "2024-01-28T10:00:00Z" })
    createdAt: Date;

    @ApiProperty({ example: "2024-01-28T10:00:00Z" })
    updatedAt: Date;

    @ApiProperty({ example: "2024-01-28T10:00:00Z" })
    lastPostAt: Date;
}

export class CreateForumTopicDto {
    @ApiProperty({ example: "How to use the forum?" })
    @IsString()
    title: string;

    @ApiProperty({ example: "This is a detailed discussion..." })
    @IsString()
    content: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    categoryId: number;
}

export class UpdateForumTopicDto {
    @ApiProperty({ example: "How to use the forum?", required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: "This is a detailed discussion...", required: false })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isPinned?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isLocked?: boolean;

    @ApiProperty({ example: "Open", enum: TopicStatus, required: false })
    @IsEnum(TopicStatus)
    @IsOptional()
    status?: TopicStatus;
}
