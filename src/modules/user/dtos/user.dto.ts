import { IsNumber, IsString, IsOptional, IsEnum, Min, IsEmail, MinLength, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export enum FavoriteType {
    MOVIES = "movies",
    SERIES = "series",
    ACTORS = "actors",
    CREW = "crew",
    SEASONS = "seasons",
    EPISODES = "episodes",
}

export class UserQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    perPage?: number = 12;

    @IsOptional()
    @IsString()
    userName?: string;

    @IsOptional()
    @IsString()
    sortBy?: string = "userName";

    @IsOptional()
    @IsEnum(["asc", "desc"])
    ascOrDesc?: "asc" | "desc" = "asc";

    @IsOptional()
    @IsString()
    filterNameString?: string;

    @IsOptional()
    @IsString()
    filterOperatorString?: string;

    @IsOptional()
    @IsString()
    filterValue?: string;
}

export class UserResponseDto {
    id: number;
    userName: string;
    email?: string;
    avatar?: string;
    bio?: string;
}

export class UsersListResponseDto {
    users: UserResponseDto[];
    total: number;
    page: number;
    perPage: number;
}

export class AddFavoriteDto {
    @IsNumber()
    itemId: number;

    @IsEnum(FavoriteType)
    type: FavoriteType;
}

export class RemoveFavoriteDto {
    @IsNumber()
    itemId: number;

    @IsEnum(FavoriteType)
    type: FavoriteType;
}

export class GetFavoritesQueryDto {
    @IsOptional()
    @IsEnum(FavoriteType)
    type?: FavoriteType;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsString()
    search?: string = "";
}

export class FavoriteResponseDto {
    id: number;
    title?: string;
    fullname?: string;
    image?: string;
}

export class FavoritesListResponseDto {
    items: FavoriteResponseDto[];
    total: number;
    page: number;
    perPage: number;
}

export class FollowDto {
    @IsNumber()
    followingId: number;
}

export class UnfollowDto {
    @IsNumber()
    followingId: number;
}

export class FollowRequestDto {
    @IsNumber()
    followerId: number;

    @IsNumber()
    followingId: number;
}

export class FollowResponseDto {
    id: number;
    follower: UserResponseDto;
    following: UserResponseDto;
    state: "pending" | "accepted";
    createdAt: Date;
}

export class FollowListResponseDto {
    items: FollowResponseDto[];
    total: number;
    page: number;
    perPage: number;
}

export class SendMessageDto {
    @IsNumber()
    receiverId: number;

    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    text: string;
}

export class MessageResponseDto {
    id: number;
    text: string;
    sender: UserResponseDto;
    receiver: UserResponseDto;
    createdAt: Date;
    isRead: boolean;
}

export class MessagesListResponseDto {
    items: MessageResponseDto[];
    total: number;
    page: number;
    perPage: number;
}

export class ReviewVoteDto {
    @IsNumber()
    reviewId: number;

    @IsEnum(["movie", "serie", "season", "episode", "actor", "crew"])
    reviewType: string;
}

export class AddReviewDto {
    @IsNumber()
    itemId: number;

    @IsEnum(["movie", "serie", "season", "episode", "actor", "crew"])
    itemType: string;

    @IsString()
    @MinLength(1)
    content: string;

    @IsNumber()
    @Min(1)
    rating: number;
}

export class UpdateReviewDto {
    @IsString()
    @MinLength(1)
    content: string;

    @IsNumber()
    @Min(1)
    rating: number;
}

export class RemoveReviewDto {
    @IsNumber()
    itemId: number;

    @IsEnum(["movie", "serie", "season", "episode", "actor", "crew"])
    itemType: string;
}

export class UserProfileDto {
    id: number;
    userName: string;
    email: string;
    avatar?: string;
    bio?: string;
    followersCount: number;
    followingCount: number;
    reviewsCount: number;
    favoritesCount: number;
}
