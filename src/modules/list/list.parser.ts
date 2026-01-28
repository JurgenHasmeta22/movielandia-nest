import { Prisma } from "@prisma/client";

export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
}

export class ListParser {
    static parseListQuery(query: any): {
        filters: Prisma.ListWhereInput;
        orderByObject: Prisma.ListOrderByWithRelationInput;
        skip: number;
        take: number;
    } {
        const { sortBy, ascOrDesc = SortOrder.ASC, perPage = 12, page = 1, name, isPrivate } = query;

        const filters: Prisma.ListWhereInput = {};
        const orderByObject: Prisma.ListOrderByWithRelationInput = {};

        const skip = (page - 1) * perPage;
        const take = perPage;

        if (name) {
            filters.name = { contains: name.toLowerCase() };
        }

        if (isPrivate !== undefined) {
            filters.isPrivate = isPrivate;
        }

        orderByObject[sortBy || "createdAt"] = ascOrDesc || SortOrder.ASC;

        return {
            filters,
            orderByObject,
            skip,
            take,
        };
    }
}
