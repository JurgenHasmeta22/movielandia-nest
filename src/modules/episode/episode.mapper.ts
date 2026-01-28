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
        episode: Episode,
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
        };
    }

    static toListResponseDto(data: { episodes: EpisodeDetailsDto[]; count: number }): EpisodeListResponseDto {
        return {
            episodes: data.episodes,
            count: data.count,
        };
    }
}
