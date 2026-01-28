import { Injectable } from "@nestjs/common";
import { GetVotesQueryDto } from "./dtos/review-votes.dto";

@Injectable()
export class ReviewParser {
    parseVotesQuery(query: GetVotesQueryDto): any {
        return {
            type: query.type,
            page: query.page || 1,
            perPage: query.perPage || 10,
        };
    }
}
