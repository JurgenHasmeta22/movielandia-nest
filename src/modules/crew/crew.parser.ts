import { CrewQueryDto, SortOrder } from "./dtos/crew-query.dto";
import { Prisma } from "@prisma/client";

export class CrewParser {
    static parseCrewQuery(query: CrewQueryDto): {
        filters: Prisma.CrewWhereInput;
        orderByObject: Prisma.CrewOrderByWithRelationInput;
        skip: number;
        take: number;
    } {
        const { sortBy, ascOrDesc = SortOrder.ASC, perPage = 12, page = 1, fullname, role } = query;

        const filters: Prisma.CrewWhereInput = {};
        const orderByObject: Prisma.CrewOrderByWithRelationInput = {};

        const skip = (page - 1) * perPage;
        const take = perPage;

        if (fullname) {
            filters.fullname = { contains: fullname.toLowerCase() };
        }

        if (role) {
            filters.role = { contains: role.toLowerCase() };
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
