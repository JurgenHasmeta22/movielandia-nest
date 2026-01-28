import { Test, TestingModule } from "@nestjs/testing";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { PrismaService } from "../../prisma.service";
import { reviewMockData } from "./review.mock-data";
import { ReviewType } from "./dtos/review-votes.dto";

describe("ReviewController", () => {
    let controller: ReviewController;
    let service: ReviewService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReviewController],
            providers: [
                {
                    provide: ReviewService,
                    useValue: {
                        getUpvotesByReviewId: jest.fn().mockResolvedValue(reviewMockData.votesResponse),
                        getDownvotesByReviewId: jest.fn().mockResolvedValue(reviewMockData.votesResponse),
                    },
                },
                {
                    provide: PrismaService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<ReviewController>(ReviewController);
        service = module.get<ReviewService>(ReviewService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getUpvotes", () => {
        it("should return upvotes for a review", async () => {
            const result = await controller.getUpvotes(1, {
                type: ReviewType.MOVIE,
                page: 1,
                perPage: 10,
            });

            expect(result).toEqual(reviewMockData.votesResponse);
            expect(service.getUpvotesByReviewId).toHaveBeenCalledWith(1, ReviewType.MOVIE, 1, 10);
        });
    });

    describe("getDownvotes", () => {
        it("should return downvotes for a review", async () => {
            const result = await controller.getDownvotes(1, {
                type: ReviewType.MOVIE,
                page: 1,
                perPage: 10,
            });

            expect(result).toEqual(reviewMockData.votesResponse);
            expect(service.getDownvotesByReviewId).toHaveBeenCalledWith(1, ReviewType.MOVIE, 1, 10);
        });
    });
});
