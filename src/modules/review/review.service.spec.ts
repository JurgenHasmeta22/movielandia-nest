import { Test, TestingModule } from "@nestjs/testing";
import { ReviewService } from "./review.service";
import { PrismaService } from "../../prisma.service";
import { ReviewType } from "./dtos/review-votes.dto";
import { reviewMockData } from "./review.mock-data";

describe("ReviewService", () => {
    let service: ReviewService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewService,
                {
                    provide: PrismaService,
                    useValue: {
                        upvoteMovieReview: {
                            findMany: jest.fn().mockResolvedValue(reviewMockData.upvotes),
                            count: jest.fn().mockResolvedValue(2),
                        },
                        downvoteMovieReview: {
                            findMany: jest.fn().mockResolvedValue(reviewMockData.downvotes),
                            count: jest.fn().mockResolvedValue(1),
                        },
                        upvoteSerieReview: {
                            findMany: jest.fn().mockResolvedValue(reviewMockData.upvotes),
                            count: jest.fn().mockResolvedValue(2),
                        },
                        downvoteSerieReview: {
                            findMany: jest.fn().mockResolvedValue(reviewMockData.downvotes),
                            count: jest.fn().mockResolvedValue(1),
                        },
                        upvoteSeasonReview: {
                            findMany: jest.fn().mockResolvedValue(reviewMockData.upvotes),
                            count: jest.fn().mockResolvedValue(2),
                        },
                        downvoteSeasonReview: {
                            findMany: jest.fn().mockResolvedValue(reviewMockData.downvotes),
                            count: jest.fn().mockResolvedValue(1),
                        },
                        upvoteEpisodeReview: {
                            findMany: jest.fn().mockResolvedValue(reviewMockData.upvotes),
                            count: jest.fn().mockResolvedValue(2),
                        },
                        downvoteEpisodeReview: {
                            findMany: jest.fn().mockResolvedValue(reviewMockData.downvotes),
                            count: jest.fn().mockResolvedValue(1),
                        },
                        upvoteActorReview: {
                            findMany: jest.fn().mockResolvedValue(reviewMockData.upvotes),
                            count: jest.fn().mockResolvedValue(2),
                        },
                        downvoteActorReview: {
                            findMany: jest.fn().mockResolvedValue(reviewMockData.downvotes),
                            count: jest.fn().mockResolvedValue(1),
                        },
                        upvoteCrewReview: {
                            findMany: jest.fn().mockResolvedValue(reviewMockData.upvotes),
                            count: jest.fn().mockResolvedValue(2),
                        },
                        downvoteCrewReview: {
                            findMany: jest.fn().mockResolvedValue(reviewMockData.downvotes),
                            count: jest.fn().mockResolvedValue(1),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<ReviewService>(ReviewService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getUpvotesByReviewId", () => {
        it("should return upvotes for a review", async () => {
            const result = await service.getUpvotesByReviewId(1, ReviewType.MOVIE, 1, 10);

            expect(result).toBeDefined();
            expect(result.items).toEqual(reviewMockData.upvotes);
            expect(result.total).toBe(2);
        });
    });

    describe("getDownvotesByReviewId", () => {
        it("should return downvotes for a review", async () => {
            const result = await service.getDownvotesByReviewId(1, ReviewType.MOVIE, 1, 10);

            expect(result).toBeDefined();
            expect(result.items).toEqual(reviewMockData.downvotes);
            expect(result.total).toBe(1);
        });
    });
});
