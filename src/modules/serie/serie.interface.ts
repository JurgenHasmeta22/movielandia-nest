import { Serie as PrismaSerie } from "@prisma/client";

export interface ISerie extends PrismaSerie {}

export interface ISerieRatingInfo {
    averageRating: number;
    totalReviews: number;
}

export interface ISerieWithDetails extends ISerie {
    ratings?: ISerieRatingInfo;
    isBookmarked?: boolean;
    isReviewed?: boolean;
}

export interface IRelatedSeriesResponse {
    series: ISerieWithDetails[] | null;
    count: number;
}

export interface ISerieListResponse {
    series: ISerieWithDetails[];
    count: number;
}
