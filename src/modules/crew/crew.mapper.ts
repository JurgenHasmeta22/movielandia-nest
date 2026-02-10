import { Crew } from "@prisma/client";
import { CrewListResponseDto, CrewDetailsDto, CrewRatingInfo } from "./dtos/crew-response.dto";
import { ICrewRatingInfo } from "./crew.interface";
import { truncateText } from "../../utils/transform.util";

export class CrewMapper {
    static toDto(crew: Crew): CrewDetailsDto {
        return {
            id: crew.id,
            fullname: crew.fullname,
            role: crew.role,
            description: crew.description,
            photoSrc: crew.photoSrc,
            photoSrcProd: crew.photoSrcProd,
            debut: crew.debut,
        };
    }

    static toDtoWithDetails(
        crew: any,
        ratingInfo?: ICrewRatingInfo,
        bookmarkInfo?: { isBookmarked: boolean },
        reviewInfo?: { isReviewed: boolean },
    ): CrewDetailsDto {
        return {
            ...this.toDto(crew),
            description: crew.description ? truncateText(crew.description, 200) : undefined,
            ratings: ratingInfo
                ? {
                      averageRating: ratingInfo.averageRating,
                      totalReviews: ratingInfo.totalReviews,
                  }
                : undefined,
            isBookmarked: bookmarkInfo?.isBookmarked || false,
            isReviewed: reviewInfo?.isReviewed || false,
            reviews: crew.reviews ? crew.reviews.map((review: any) => ({
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

    static toListResponseDto(data: { crew: CrewDetailsDto[]; count: number }): CrewListResponseDto {
        return {
            crew: data.crew,
            count: data.count,
        };
    }
}
