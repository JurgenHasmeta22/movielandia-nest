import { Movie } from "@prisma/client";
import { IMovieRatingInfo, IMovieWithDetails } from "./movie.interface";

export const mockMovie: Movie = {
    id: 1,
    title: "test movie",
    description: "A test movie",
    photoSrc: "test.jpg",
    photoSrcProd: "test-prod.jpg",
    trailerSrc: "trailer.mp4",
    duration: 120,
    dateAired: new Date("2024-01-01"),
    ratingImdb: 8.5,
};

export const mockMovieRatingInfo: IMovieRatingInfo = {
    averageRating: 4.5,
    totalReviews: 10,
};

export const mockMovieWithDetails: IMovieWithDetails = {
    ...mockMovie,
    ratings: mockMovieRatingInfo,
    isBookmarked: true,
    isReviewed: false,
};
