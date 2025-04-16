import { Movie } from "@prisma/client";
import { MovieListResponseDto, MovieDetailsDto, MovieRatingInfo } from "./dtos/movie-response.dto";
import { IMovieRatingInfo } from "./movie.interface";
import { formatDate, parseRuntime, truncateText, slugify } from "../../utils/transform.util";

export class MovieMapper {
    static toDto(movie: Movie): MovieDetailsDto {
        return {
            id: movie.id,
            title: movie.title,
            description: movie.description,
            photoSrc: movie.photoSrc,
            photoSrcProd: movie.photoSrcProd,
            trailerSrc: movie.trailerSrc,
            duration: movie.duration,
            ratingImdb: movie.ratingImdb,
            dateAired: movie.dateAired,
        };
    }

    static toDtoWithDetails(
        movie: Movie,
        ratingInfo?: IMovieRatingInfo,
        bookmarkInfo?: { isBookmarked: boolean },
        reviewInfo?: { isReviewed: boolean },
    ): MovieDetailsDto {
        return {
            ...this.toDto(movie),
            description: movie.description ? truncateText(movie.description, 200) : undefined,
            ratings: ratingInfo
                ? {
                      averageRating: ratingInfo.averageRating,
                      totalReviews: ratingInfo.totalReviews,
                  }
                : undefined,
            isBookmarked: bookmarkInfo?.isBookmarked || false,
            isReviewed: reviewInfo?.isReviewed || false,
        };
    }

    static toListResponseDto(data: { movies: MovieDetailsDto[]; count: number }): MovieListResponseDto {
        return {
            movies: data.movies,
            count: data.count,
        };
    }

    static toRelatedResponseDto(data: { movies: MovieDetailsDto[] | null; count: number }): MovieListResponseDto {
        return {
            movies: data.movies || [],
            count: data.count,
        };
    }
}
