import { Episode as PrismaEpisode } from "@prisma/client";

export interface IEpisode extends PrismaEpisode {}

export interface IEpisodeRatingInfo {
    averageRating: number;
    totalReviews: number;
}

export interface IEpisodeWithDetails extends IEpisode {
    ratings?: IEpisodeRatingInfo;
    isBookmarked?: boolean;
    isReviewed?: boolean;
}

export interface IEpisodeListResponse {
    episodes: IEpisodeWithDetails[];
    count: number;
}
