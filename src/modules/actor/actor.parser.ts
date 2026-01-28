import { ActorQueryDto, SortOrder } from "./dtos/actor-query.dto";
import { Prisma } from "@prisma/client";

export class ActorParser {
    static parseActorQuery(query: ActorQueryDto): {
        filters: Prisma.ActorWhereInput;
        orderByObject: Prisma.ActorOrderByWithRelationInput;
        skip: number;
        take: number;
    } {
        const {
            sortBy,
            ascOrDesc = SortOrder.ASC,
            perPage = 12,
            page = 1,
            fullname,
        } = query;

        const filters: Prisma.ActorWhereInput = {};
        const orderByObject: Prisma.ActorOrderByWithRelationInput = {};

        const skip = (page - 1) * perPage;
        const take = perPage;

        if (fullname) {
            filters.fullname = { contains: fullname.toLowerCase() };
        }

        orderByObject[sortBy || "fullname"] = ascOrDesc || SortOrder.ASC;

        return {
            filters,
            orderByObject,
            skip,
            take,
        };
    }
}
