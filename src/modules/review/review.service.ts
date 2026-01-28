import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { ReviewType, VotesListResponseDto } from "./dtos/review-votes.dto";

@Injectable()
export class ReviewService {
    constructor(private prisma: PrismaService) {}

    async getUpvotesByReviewId(
        reviewId: number,
        type: ReviewType,
        page: number = 1,
        perPage: number = 10,
    ): Promise<VotesListResponseDto> {
        if (!Object.values(ReviewType).includes(type)) {
            throw new BadRequestException("Invalid review type");
        }

        const skip = (page - 1) * perPage;

        const upvotes = await this.getUpvotesQuery(type, reviewId, skip, perPage);
        const total = await this.getUpvotesCount(type, reviewId);

        return {
            items: upvotes,
            total,
            page,
            perPage,
        };
    }

    async getDownvotesByReviewId(
        reviewId: number,
        type: ReviewType,
        page: number = 1,
        perPage: number = 10,
    ): Promise<VotesListResponseDto> {
        if (!Object.values(ReviewType).includes(type)) {
            throw new BadRequestException("Invalid review type");
        }

        const skip = (page - 1) * perPage;

        const downvotes = await this.getDownvotesQuery(type, reviewId, skip, perPage);
        const total = await this.getDownvotesCount(type, reviewId);

        return {
            items: downvotes,
            total,
            page,
            perPage,
        };
    }

    private async getUpvotesQuery(type: ReviewType, reviewId: number, skip: number, take: number): Promise<any[]> {
        switch (type) {
            case ReviewType.MOVIE:
                return this.prisma.upvoteMovieReview.findMany({
                    where: { movieReviewId: reviewId },
                    include: { user: { select: { id: true, userName: true, avatar: true } } },
                    skip,
                    take,
                });
            case ReviewType.SERIE:
                return this.prisma.upvoteSerieReview.findMany({
                    where: { serieReviewId: reviewId },
                    include: { user: { select: { id: true, userName: true, avatar: true } } },
                    skip,
                    take,
                });
            case ReviewType.SEASON:
                return this.prisma.upvoteSeasonReview.findMany({
                    where: { seasonReviewId: reviewId },
                    include: { user: { select: { id: true, userName: true, avatar: true } } },
                    skip,
                    take,
                });
            case ReviewType.EPISODE:
                return this.prisma.upvoteEpisodeReview.findMany({
                    where: { episodeReviewId: reviewId },
                    include: { user: { select: { id: true, userName: true, avatar: true } } },
                    skip,
                    take,
                });
            case ReviewType.ACTOR:
                return this.prisma.upvoteActorReview.findMany({
                    where: { actorReviewId: reviewId },
                    include: { user: { select: { id: true, userName: true, avatar: true } } },
                    skip,
                    take,
                });
            case ReviewType.CREW:
                return this.prisma.upvoteCrewReview.findMany({
                    where: { crewReviewId: reviewId },
                    include: { user: { select: { id: true, userName: true, avatar: true } } },
                    skip,
                    take,
                });
            default:
                throw new BadRequestException("Invalid review type");
        }
    }

    private async getUpvotesCount(type: ReviewType, reviewId: number): Promise<number> {
        switch (type) {
            case ReviewType.MOVIE:
                return this.prisma.upvoteMovieReview.count({ where: { movieReviewId: reviewId } });
            case ReviewType.SERIE:
                return this.prisma.upvoteSerieReview.count({ where: { serieReviewId: reviewId } });
            case ReviewType.SEASON:
                return this.prisma.upvoteSeasonReview.count({ where: { seasonReviewId: reviewId } });
            case ReviewType.EPISODE:
                return this.prisma.upvoteEpisodeReview.count({ where: { episodeReviewId: reviewId } });
            case ReviewType.ACTOR:
                return this.prisma.upvoteActorReview.count({ where: { actorReviewId: reviewId } });
            case ReviewType.CREW:
                return this.prisma.upvoteCrewReview.count({ where: { crewReviewId: reviewId } });
            default:
                throw new BadRequestException("Invalid review type");
        }
    }

    private async getDownvotesQuery(type: ReviewType, reviewId: number, skip: number, take: number): Promise<any[]> {
        switch (type) {
            case ReviewType.MOVIE:
                return this.prisma.downvoteMovieReview.findMany({
                    where: { movieReviewId: reviewId },
                    include: { user: { select: { id: true, userName: true, avatar: true } } },
                    skip,
                    take,
                });
            case ReviewType.SERIE:
                return this.prisma.downvoteSerieReview.findMany({
                    where: { serieReviewId: reviewId },
                    include: { user: { select: { id: true, userName: true, avatar: true } } },
                    skip,
                    take,
                });
            case ReviewType.SEASON:
                return this.prisma.downvoteSeasonReview.findMany({
                    where: { seasonReviewId: reviewId },
                    include: { user: { select: { id: true, userName: true, avatar: true } } },
                    skip,
                    take,
                });
            case ReviewType.EPISODE:
                return this.prisma.downvoteEpisodeReview.findMany({
                    where: { episodeReviewId: reviewId },
                    include: { user: { select: { id: true, userName: true, avatar: true } } },
                    skip,
                    take,
                });
            case ReviewType.ACTOR:
                return this.prisma.downvoteActorReview.findMany({
                    where: { actorReviewId: reviewId },
                    include: { user: { select: { id: true, userName: true, avatar: true } } },
                    skip,
                    take,
                });
            case ReviewType.CREW:
                return this.prisma.downvoteCrewReview.findMany({
                    where: { crewReviewId: reviewId },
                    include: { user: { select: { id: true, userName: true, avatar: true } } },
                    skip,
                    take,
                });
            default:
                throw new BadRequestException("Invalid review type");
        }
    }

    private async getDownvotesCount(type: ReviewType, reviewId: number): Promise<number> {
        switch (type) {
            case ReviewType.MOVIE:
                return this.prisma.downvoteMovieReview.count({ where: { movieReviewId: reviewId } });
            case ReviewType.SERIE:
                return this.prisma.downvoteSerieReview.count({ where: { serieReviewId: reviewId } });
            case ReviewType.SEASON:
                return this.prisma.downvoteSeasonReview.count({ where: { seasonReviewId: reviewId } });
            case ReviewType.EPISODE:
                return this.prisma.downvoteEpisodeReview.count({ where: { episodeReviewId: reviewId } });
            case ReviewType.ACTOR:
                return this.prisma.downvoteActorReview.count({ where: { actorReviewId: reviewId } });
            case ReviewType.CREW:
                return this.prisma.downvoteCrewReview.count({ where: { crewReviewId: reviewId } });
            default:
                throw new BadRequestException("Invalid review type");
        }
    }
}
