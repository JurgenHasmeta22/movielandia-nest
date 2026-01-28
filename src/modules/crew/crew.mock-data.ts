import { Crew } from "@prisma/client";
import { ICrewRatingInfo, ICrewWithDetails } from "./crew.interface";

export const mockCrew: Crew = {
    id: 1,
    fullname: "christopher nolan",
    role: "director",
    description: "British film and television director",
    photoSrc: "test.jpg",
    photoSrcProd: "test-prod.jpg",
    debut: "1998",
};

export const mockCrewRatingInfo: ICrewRatingInfo = {
    averageRating: 4.7,
    totalReviews: 62,
};

export const mockCrewWithDetails: ICrewWithDetails = {
    ...mockCrew,
    ratings: mockCrewRatingInfo,
    isBookmarked: true,
    isReviewed: false,
};
