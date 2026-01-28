export interface IReviewVote {
    id: number;
    userId: number;
    reviewId: number;
    createdAt: Date;
}

export interface IReviewVoteUser {
    id: number;
    userName: string;
    email: string;
    avatar?: string;
}

export interface IReviewVoteItem {
    id: number;
    user: IReviewVoteUser;
    createdAt: Date;
}
