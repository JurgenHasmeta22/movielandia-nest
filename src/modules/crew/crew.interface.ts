import { Crew as PrismaCrew } from "@prisma/client";

export interface ICrew extends PrismaCrew {}

export interface ICrewRatingInfo {
    averageRating: number;
    totalReviews: number;
}

export interface ICrewWithDetails extends ICrew {
    ratings?: ICrewRatingInfo;
    isBookmarked?: boolean;
    isReviewed?: boolean;
}

export interface ICrewListResponse {
    crew: ICrewWithDetails[];
    count: number;
}
