import { Prisma } from "@prisma/client";

export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
}

export class ForumParser {
    static parseForumCategoryQuery(query: any): {
        filters: Prisma.ForumCategoryWhereInput;
        orderByObject: Prisma.ForumCategoryOrderByWithRelationInput;
        skip: number;
        take: number;
    } {
        const { sortBy, ascOrDesc = SortOrder.ASC, perPage = 12, page = 1, name } = query;

        const filters: Prisma.ForumCategoryWhereInput = {};
        const orderByObject: Prisma.ForumCategoryOrderByWithRelationInput = {};

        const skip = (page - 1) * perPage;
        const take = perPage;

        if (name) {
            filters.name = { contains: name.toLowerCase() };
        }

        filters.isActive = true;

        orderByObject[sortBy || "order"] = ascOrDesc || SortOrder.ASC;

        return {
            filters,
            orderByObject,
            skip,
            take,
        };
    }

    static parseForumTopicQuery(query: any): {
        filters: Prisma.ForumTopicWhereInput;
        orderByObject: Prisma.ForumTopicOrderByWithRelationInput;
        skip: number;
        take: number;
    } {
        const { sortBy, ascOrDesc = SortOrder.ASC, perPage = 20, page = 1, title } = query;

        const filters: Prisma.ForumTopicWhereInput = {};
        const orderByObject: Prisma.ForumTopicOrderByWithRelationInput = {};

        const skip = (page - 1) * perPage;
        const take = perPage;

        if (title) {
            filters.title = { contains: title.toLowerCase() };
        }

        orderByObject[sortBy || "createdAt"] = ascOrDesc || SortOrder.DESC;

        return {
            filters,
            orderByObject,
            skip,
            take,
        };
    }

    static parseForumPostQuery(query: any): {
        filters: Prisma.ForumPostWhereInput;
        orderByObject: Prisma.ForumPostOrderByWithRelationInput;
        skip: number;
        take: number;
    } {
        const { sortBy, ascOrDesc = SortOrder.ASC, perPage = 20, page = 1 } = query;

        const filters: Prisma.ForumPostWhereInput = {
            isDeleted: false,
        };
        const orderByObject: Prisma.ForumPostOrderByWithRelationInput = {};

        const skip = (page - 1) * perPage;
        const take = perPage;

        orderByObject[sortBy || "createdAt"] = ascOrDesc || SortOrder.ASC;

        return {
            filters,
            orderByObject,
            skip,
            take,
        };
    }
}
