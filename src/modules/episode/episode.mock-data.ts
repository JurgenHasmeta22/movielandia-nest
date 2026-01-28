import { Episode, EpisodeReview } from "@prisma/client";

export const mockEpisodes: Episode[] = [
    {
        id: 1,
        title: "Pilot",
        photoSrc: "https://example.com/episode1.jpg",
        photoSrcProd: "https://example.com/episode1-prod.jpg",
        trailerSrc: "https://example.com/trailers/episode1.mp4",
        description: "The first episode of the series",
        dateAired: new Date("2020-01-01"),
        ratingImdb: 8.5,
        duration: 45,
        seasonId: 1,
    },
];

export const mockEpisodeReviews: EpisodeReview[] = [
    {
        id: 1,
        content: "Amazing episode!",
        rating: 5,
        createdAt: new Date(),
        updatedAt: null,
        userId: 1,
        episodeId: 1,
    },
];
