import { Serie } from "@prisma/client";
import { ISerieRatingInfo, ISerieWithDetails } from "./serie.interface";

export const mockSerie: Serie = {
    id: 1,
    title: "breaking bad",
    description: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing methamphetamine",
    photoSrc: "test.jpg",
    photoSrcProd: "test-prod.jpg",
    trailerSrc: "trailer.mp4",
    dateAired: new Date("2008-01-20"),
    ratingImdb: 9.5,
};

export const mockSerieRatingInfo: ISerieRatingInfo = {
    averageRating: 4.7,
    totalReviews: 156,
};

export const mockSerieWithDetails: ISerieWithDetails = {
    ...mockSerie,
    ratings: mockSerieRatingInfo,
    isBookmarked: true,
    isReviewed: false,
};
