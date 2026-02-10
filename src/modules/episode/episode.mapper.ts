import { Episode } from "@prisma/client";
import { EpisodeListResponseDto, EpisodeDetailsDto, EpisodeRatingInfo } from "./dtos/episode-response.dto";
import { IEpisodeRatingInfo } from "./episode.interface";
import { truncateText } from "../../utils/transform.util";

export class EpisodeMapper {
    static toDto(episode: Episode): EpisodeDetailsDto {
        return {
            id: episode.id,
            title: episode.title,
            description: episode.description,
            photoSrc: episode.photoSrc,
            photoSrcProd: episode.photoSrcProd,
            trailerSrc: episode.trailerSrc,
            ratingImdb: episode.ratingImdb,
            dateAired: episode.dateAired,
            duration: episode.duration,
            seasonId: episode.seasonId,
        };
    }

    static toDtoWithDetails(
        episode: any,
        ratingInfo?: IEpisodeRatingInfo,
        bookmarkInfo?: { isBookmarked: boolean },
        reviewInfo?: { isReviewed: boolean },
    ): EpisodeDetailsDto {
        return {
            ...this.toDto(episode),
            description: episode.description ? truncateText(episode.description, 200) : undefined,
            ratings: ratingInfo
                ? {
                      averageRating: ratingInfo.averageRating,
                      totalReviews: ratingInfo.totalReviews,
                  }
                : undefined,
            isBookmarked: bookmarkInfo?.isBookmarked || false,
            isReviewed: reviewInfo?.isReviewed || false,
            reviews: episode.reviews ? episode.reviews.map((review: any) => ({
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

    static toListResponseDto(data: { episodes: EpisodeDetailsDto[]; count: number }): EpisodeListResponseDto {
        return {
            episodes: data.episodes,
            count: data.count,
        };
    }
}
