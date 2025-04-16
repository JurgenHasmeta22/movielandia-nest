import { Movie } from "@prisma/client";
import {
    MovieDetailsDto,
    MovieListResponseDto,
    MovieRatingInfo,
    RelatedMoviesResponseDto,
} from "./dtos/movie-response.dto";
import {
    IMovie,
    IMovieRatingInfo,
    IMovieWithDetails,
    IRelatedMoviesResponse,
    IMovieListResponse,
} from "./movie.interface";

export class MovieMapper {
    static toDto(movie: IMovie): MovieDetailsDto {
        return {
            ...movie,
        };
    }

    static toDtoWithDetails(
        movie: IMovie,
        ratingsInfo?: IMovieRatingInfo,
        bookmarkInfo?: { isBookmarked: boolean } | Record<string, never>,
        reviewInfo?: { isReviewed: boolean } | Record<string, never>,
    ): MovieDetailsDto {
        return {
            ...movie,
            ...(ratingsInfo && { ratings: this.toRatingInfoDto(ratingsInfo) }),
            ...(Object.keys(bookmarkInfo || {}).length > 0 && bookmarkInfo),
            ...(Object.keys(reviewInfo || {}).length > 0 && reviewInfo),
        };
    }

    static toRatingInfoDto(ratingInfo: IMovieRatingInfo): MovieRatingInfo {
        return {
            averageRating: ratingInfo.averageRating,
            totalReviews: ratingInfo.totalReviews,
        };
    }

    static toListResponseDto(response: IMovieListResponse): MovieListResponseDto {
        return {
            movies: response.movies.map((movie) => this.toDtoWithDetails(movie)),
            count: response.count,
        };
    }

    static toRelatedResponseDto(response: IRelatedMoviesResponse): RelatedMoviesResponseDto {
        return {
            movies: response.movies?.map((movie) => this.toDtoWithDetails(movie)) ?? null,
            count: response.count,
        };
    }
}
