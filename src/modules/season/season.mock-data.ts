import { Season, SeasonReview } from "@prisma/client";

export const mockSeasons: Season[] = [
    {
        id: 1,
        title: "Season 1",
        photoSrc: "https://example.com/season1.jpg",
        photoSrcProd: "https://example.com/season1-prod.jpg",
        trailerSrc: "https://example.com/trailers/season1.mp4",
        description: "The first season of the series",
        dateAired: new Date("2020-01-01"),
        ratingImdb: 8.5,
        serieId: 1,
    },
];

export const mockSeasonReviews: SeasonReview[] = [
    {
        id: 1,
        content: "Great season!",
        rating: 5,
        createdAt: new Date(),
        updatedAt: null,
        userId: 1,
        seasonId: 1,
    },
];
