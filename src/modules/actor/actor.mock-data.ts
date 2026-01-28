import { Actor } from "@prisma/client";
import { IActorRatingInfo, IActorWithDetails } from "./actor.interface";

export const mockActor: Actor = {
    id: 1,
    fullname: "leonardo dicaprio",
    description: "American actor and producer",
    photoSrc: "test.jpg",
    photoSrcProd: "test-prod.jpg",
    debut: "1991",
};

export const mockActorRatingInfo: IActorRatingInfo = {
    averageRating: 4.6,
    totalReviews: 87,
};

export const mockActorWithDetails: IActorWithDetails = {
    ...mockActor,
    ratings: mockActorRatingInfo,
    isBookmarked: true,
    isReviewed: false,
};
