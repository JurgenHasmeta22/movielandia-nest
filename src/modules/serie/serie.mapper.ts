import { Serie } from "@prisma/client";
import { SerieListResponseDto, SerieDetailsDto, SerieRatingInfo } from "./dtos/serie-response.dto";
import { ISerieRatingInfo } from "./serie.interface";
import { truncateText } from "../../utils/transform.util";

export class SerieMapper {
    static toDto(serie: Serie): SerieDetailsDto {
        return {
            id: serie.id,
            title: serie.title,
            description: serie.description,
            photoSrc: serie.photoSrc,
            photoSrcProd: serie.photoSrcProd,
            trailerSrc: serie.trailerSrc,
            ratingImdb: serie.ratingImdb,
            dateAired: serie.dateAired,
        };
    }

    static toDtoWithDetails(
        serie: Serie,
        ratingInfo?: ISerieRatingInfo,
        bookmarkInfo?: { isBookmarked: boolean },
        reviewInfo?: { isReviewed: boolean },
    ): SerieDetailsDto {
        return {
            ...this.toDto(serie),
            description: serie.description ? truncateText(serie.description, 200) : undefined,
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

    static toListResponseDto(data: { series: SerieDetailsDto[]; count: number }): SerieListResponseDto {
        return {
            series: data.series,
            count: data.count,
        };
    }

    static toRelatedResponseDto(data: { series: SerieDetailsDto[] | null; count: number }): SerieListResponseDto {
        return {
            series: data.series || [],
            count: data.count,
        };
    }
}
