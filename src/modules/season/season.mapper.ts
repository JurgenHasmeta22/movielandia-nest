import { Season } from "@prisma/client";
import { SeasonListResponseDto, SeasonDetailsDto, SeasonRatingInfo } from "./dtos/season-response.dto";
import { ISeasonRatingInfo } from "./season.interface";
import { truncateText } from "../../utils/transform.util";

export class SeasonMapper {
    static toDto(season: Season): SeasonDetailsDto {
        return {
            id: season.id,
            title: season.title,
            description: season.description,
            photoSrc: season.photoSrc,
            photoSrcProd: season.photoSrcProd,
            trailerSrc: season.trailerSrc,
            ratingImdb: season.ratingImdb,
            dateAired: season.dateAired,
            serieId: season.serieId,
        };
    }

    static toDtoWithDetails(
        season: any,
        ratingInfo?: ISeasonRatingInfo,
        bookmarkInfo?: { isBookmarked: boolean },
        reviewInfo?: { isReviewed: boolean },
    ): SeasonDetailsDto {
        return {
            ...this.toDto(season),
            description: season.description ? truncateText(season.description, 200) : undefined,
            ratings: ratingInfo
                ? {
                      averageRating: ratingInfo.averageRating,
                      totalReviews: ratingInfo.totalReviews,
                  }
                : undefined,
            isBookmarked: bookmarkInfo?.isBookmarked || false,
            isReviewed: reviewInfo?.isReviewed || false,
            reviews: season.reviews ? season.reviews.map((review: any) => ({
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

    static toListResponseDto(data: { seasons: SeasonDetailsDto[]; count: number }): SeasonListResponseDto {
        return {
            seasons: data.seasons,
            count: data.count,
        };
    }
}
