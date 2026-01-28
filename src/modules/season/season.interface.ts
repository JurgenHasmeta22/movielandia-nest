import { Season as PrismaSeason } from "@prisma/client";

export interface ISeason extends PrismaSeason {}

export interface ISeasonRatingInfo {
    averageRating: number;
    totalReviews: number;
}

export interface ISeasonWithDetails extends ISeason {
    ratings?: ISeasonRatingInfo;
    isBookmarked?: boolean;
    isReviewed?: boolean;
}

export interface ISeasonListResponse {
    seasons: ISeasonWithDetails[];
    count: number;
}
