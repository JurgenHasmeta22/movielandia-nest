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
        actor: Actor,
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
        };
    }

    static toListResponseDto(data: { actors: ActorDetailsDto[]; count: number }): ActorListResponseDto {
        return {
            actors: data.actors,
            count: data.count,
        };
    }
}
