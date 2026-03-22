import { Controller, Get, Param, Query, ParseIntPipe, Req, Res } from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { ReviewService } from "./review.service";
import { GetVotesQueryDto } from "./dtos/review-votes.dto";
import { Request, Response } from "express";

@Controller("reviews")
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get(":reviewId/upvotes")
    @Inertia("Reviews/Votes")
    async getUpvotes(@Param("reviewId", ParseIntPipe) reviewId: number, @Query() query: GetVotesQueryDto) {
        const votes = await this.reviewService.getUpvotesByReviewId(reviewId, query.type, query.page || 1, query.perPage || 10);
        return { reviewId, voteType: "up", votes };
    }

    @Get(":reviewId/downvotes")
    @Inertia("Reviews/Votes")
    async getDownvotes(@Param("reviewId", ParseIntPipe) reviewId: number, @Query() query: GetVotesQueryDto) {
        const votes = await this.reviewService.getDownvotesByReviewId(reviewId, query.type, query.page || 1, query.perPage || 10);
        return { reviewId, voteType: "down", votes };
    }
}

