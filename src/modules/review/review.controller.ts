import { Controller, Get, Param, Query, ParseIntPipe, HttpStatus, UseGuards, ValidationPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ReviewService } from "./review.service";
import { GetVotesQueryDto, VotesListResponseDto } from "./dtos/review-votes.dto";
import { OptionalAuthGuard } from "../../auth/guards/optional-auth.guard";

@ApiTags("Reviews")
@Controller("reviews")
@UseGuards(OptionalAuthGuard)
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get(":reviewId/upvotes")
    @ApiOperation({ summary: "Get upvotes for a review" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Upvotes retrieved successfully",
        type: VotesListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async getUpvotes(
        @Param("reviewId", ParseIntPipe) reviewId: number,
        @Query(new ValidationPipe({ transform: true })) query: GetVotesQueryDto,
    ): Promise<VotesListResponseDto> {
        return this.reviewService.getUpvotesByReviewId(reviewId, query.type, query.page || 1, query.perPage || 10);
    }

    @Get(":reviewId/downvotes")
    @ApiOperation({ summary: "Get downvotes for a review" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Downvotes retrieved successfully",
        type: VotesListResponseDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid query parameters" })
    async getDownvotes(
        @Param("reviewId", ParseIntPipe) reviewId: number,
        @Query(new ValidationPipe({ transform: true })) query: GetVotesQueryDto,
    ): Promise<VotesListResponseDto> {
        return this.reviewService.getDownvotesByReviewId(reviewId, query.type, query.page || 1, query.perPage || 10);
    }
}
