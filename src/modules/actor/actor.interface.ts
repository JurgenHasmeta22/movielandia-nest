import { Actor as PrismaActor } from "@prisma/client";

export interface IActor extends PrismaActor {}

export interface IActorRatingInfo {
    averageRating: number;
    totalReviews: number;
}

export interface IActorWithDetails extends IActor {
    ratings?: IActorRatingInfo;
    isBookmarked?: boolean;
    isReviewed?: boolean;
}

export interface IActorListResponse {
    actors: IActorWithDetails[];
    count: number;
}
