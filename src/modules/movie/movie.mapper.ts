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
        movie: any,
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
            reviews: movie.reviews ? movie.reviews.map((review: any) => ({
                id: review.id,
                rating: review.rating,
                content: review.content,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
                user: {
                    id: review.user.id,
                    userName: review.user.userName,
                    avatar: review.user.avatar,
                },
                isUpvoted: review.upvotes?.some((v: any) => v.user?.id === bookmarkInfo?.isBookmarked) || false,
                isDownvoted: review.downvotes?.some((v: any) => v.user?.id === bookmarkInfo?.isBookmarked) || false,
                _count: review._count,
            })) : undefined,
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
