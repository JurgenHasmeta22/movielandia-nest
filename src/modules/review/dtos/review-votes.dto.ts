import { IsNumber, IsEnum, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export enum ReviewType {
    MOVIE = "movie",
    SERIE = "serie",
    SEASON = "season",
    EPISODE = "episode",
    ACTOR = "actor",
    CREW = "crew",
}

export class GetVotesQueryDto {
    @IsEnum(ReviewType)
    type: ReviewType;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    perPage?: number = 10;
}

export class VoteResponseDto {
    id: number;
    user: {
        id: number;
        userName: string;
        avatar?: string;
    };
    createdAt: Date;
}

export class VotesListResponseDto {
    items: VoteResponseDto[];
    total: number;
    page: number;
    perPage: number;
}
