import { Injectable } from "@nestjs/common";

@Injectable()
export class ReviewMapper {
    mapVoteToDto(vote: any): any {
        return {
            id: vote.id,
            user: {
                id: vote.user.id,
                userName: vote.user.userName,
                avatar: vote.user.avatar,
            },
            createdAt: vote.createdAt,
        };
    }

    mapVotesToList(votes: any[]): any[] {
        return votes.map((vote) => this.mapVoteToDto(vote));
    }
}
