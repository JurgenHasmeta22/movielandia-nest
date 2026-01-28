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
        season: Season,
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
        };
    }

    static toListResponseDto(data: { seasons: SeasonDetailsDto[]; count: number }): SeasonListResponseDto {
        return {
            seasons: data.seasons,
            count: data.count,
        };
    }
}
