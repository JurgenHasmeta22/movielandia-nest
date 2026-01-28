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
        crew: Crew,
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
        };
    }

    static toListResponseDto(data: { crew: CrewDetailsDto[]; count: number }): CrewListResponseDto {
        return {
            crew: data.crew,
            count: data.count,
        };
    }
}
