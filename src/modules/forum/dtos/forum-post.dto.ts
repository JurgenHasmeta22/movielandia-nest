import { IsString, IsInt, IsBoolean, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

enum PostType {
    Normal = "Normal",
    Announcement = "Announcement",
    Sticky = "Sticky",
    Question = "Question",
    Answered = "Answered",
}

export class ForumPostDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "This is a great reply..." })
    content: string;

    @ApiProperty({ example: "Normal", enum: PostType })
    type: PostType;

    @ApiProperty({ example: false })
    isEdited: boolean;

    @ApiProperty({ example: false })
    isAnswer: boolean;

    @ApiProperty({ example: false })
    isDeleted: boolean;

    @ApiProperty({ example: 1 })
    topicId: number;

    @ApiProperty({ example: 1 })
    userId: number;

    @ApiProperty({ example: "2024-01-28T10:00:00Z" })
    createdAt: Date;

    @ApiProperty({ example: "2024-01-28T10:00:00Z" })
    updatedAt: Date;
}

export class CreateForumPostDto {
    @ApiProperty({ example: "This is a great reply..." })
    @IsString()
    content: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    topicId: number;

    @ApiProperty({ example: "Normal", enum: PostType, required: false })
    @IsEnum(PostType)
    @IsOptional()
    type?: PostType;
}

export class UpdateForumPostDto {
    @ApiProperty({ example: "This is an updated reply...", required: false })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiProperty({ example: "Normal", enum: PostType, required: false })
    @IsEnum(PostType)
    @IsOptional()
    type?: PostType;
}

export class ForumPostResponseDto {
    @ApiProperty({ type: [ForumPostDto] })
    posts: ForumPostDto[];

    @ApiProperty({ example: 100 })
    count: number;

    @ApiProperty({ example: 1 })
    page: number;

    @ApiProperty({ example: 10 })
    perPage: number;
}
