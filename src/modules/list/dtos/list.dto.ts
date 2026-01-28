import { IsString, IsBoolean, IsOptional, IsInt, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

enum ContentType {
    movie = "movie",
    serie = "serie",
    season = "season",
    episode = "episode",
    actor = "actor",
    crew = "crew",
    user = "user",
}

export class ListDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "My Favorite Movies" })
    name: string;

    @ApiProperty({ example: "Collection of my favorite movies", required: false })
    description?: string;

    @ApiProperty({ example: false })
    isPrivate: boolean;

    @ApiProperty({ example: false })
    isArchived: boolean;

    @ApiProperty({ example: false })
    isDefault: boolean;

    @ApiProperty({ example: "movie", enum: ContentType, required: false })
    contentType?: ContentType;

    @ApiProperty({ example: 1 })
    userId: number;

    @ApiProperty({ example: "2024-01-28T10:00:00Z" })
    createdAt: Date;

    @ApiProperty({ example: "2024-01-28T10:00:00Z" })
    updatedAt: Date;

    @ApiProperty({ example: "2024-01-28T10:00:00Z", required: false })
    lastViewedAt?: Date;
}

export class CreateListDto {
    @ApiProperty({ example: "My Favorite Movies" })
    @IsString()
    name: string;

    @ApiProperty({ example: "Collection of my favorite movies", required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isPrivate?: boolean;

    @ApiProperty({ example: "movie", enum: ContentType, required: false })
    @IsEnum(ContentType)
    @IsOptional()
    contentType?: ContentType;
}

export class UpdateListDto {
    @ApiProperty({ example: "My Favorite Movies", required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: "Collection of my favorite movies", required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isPrivate?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isArchived?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;
}

export class ListShareDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    listId: number;

    @ApiProperty({ example: 2 })
    userId: number;

    @ApiProperty({ example: false })
    canEdit: boolean;

    @ApiProperty({ example: "2024-01-28T10:00:00Z" })
    sharedAt: Date;
}

export class CreateListShareDto {
    @ApiProperty({ example: 2 })
    @IsInt()
    userId: number;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    canEdit?: boolean;
}
