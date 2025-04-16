import { Movie as PrismaMovie } from "@prisma/client";

export interface IMovie extends PrismaMovie {}

export interface IMovieRatingInfo {
    averageRating: number;
    totalReviews: number;
}

export interface IMovieWithDetails extends IMovie {
    ratings?: IMovieRatingInfo;
    isBookmarked?: boolean;
    isReviewed?: boolean;
}

export interface IRelatedMoviesResponse {
    movies: IMovieWithDetails[] | null;
    count: number;
}

export interface IMovieListResponse {
    movies: IMovieWithDetails[];
    count: number;
}
