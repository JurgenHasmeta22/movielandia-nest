import { Actor } from "@prisma/client";
import { ActorListResponseDto, ActorDetailsDto, ActorRatingInfo } from "./dtos/actor-response.dto";
import { IActorRatingInfo } from "./actor.interface";
import { truncateText } from "../../utils/transform.util";

export class ActorMapper {
    static toDto(actor: Actor): ActorDetailsDto {
        return {
            id: actor.id,
            fullname: actor.fullname,
            description: actor.description,
            photoSrc: actor.photoSrc,
            photoSrcProd: actor.photoSrcProd,
            debut: actor.debut,
        };
    }

    static toDtoWithDetails(
        actor: any,
        ratingInfo?: IActorRatingInfo,
        bookmarkInfo?: { isBookmarked: boolean },
        reviewInfo?: { isReviewed: boolean },
    ): ActorDetailsDto {
        return {
            ...this.toDto(actor),
            description: actor.description ? truncateText(actor.description, 200) : undefined,
            ratings: ratingInfo
                ? {
                      averageRating: ratingInfo.averageRating,
                      totalReviews: ratingInfo.totalReviews,
                  }
                : undefined,
            isBookmarked: bookmarkInfo?.isBookmarked || false,
            isReviewed: reviewInfo?.isReviewed || false,
            reviews: actor.reviews ? actor.reviews.map((review: any) => ({
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

    static toListResponseDto(data: { actors: ActorDetailsDto[]; count: number }): ActorListResponseDto {
        return {
            actors: data.actors,
            count: data.count,
        };
    }
}
