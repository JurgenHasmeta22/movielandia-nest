import { GenreQueryDto, SortOrder } from "./dtos/genre-query.dto";
import { Prisma } from "@prisma/client";

export class GenreParser {
    static parseGenreQuery(query: GenreQueryDto): {
        filters: Prisma.GenreWhereInput;
        orderByObject: Prisma.GenreOrderByWithRelationInput;
        skip: number;
        take: number;
    } {
        const {
            sortBy,
            ascOrDesc = SortOrder.ASC,
            perPage = 20,
            page = 1,
            name,
        } = query;

        const filters: Prisma.GenreWhereInput = {};
        const orderByObject: Prisma.GenreOrderByWithRelationInput = {};

        const skip = (page - 1) * perPage;
        const take = perPage;

        if (name) {
            filters.name = { contains: name.toLowerCase() };
        }

        orderByObject[sortBy || "name"] = ascOrDesc || SortOrder.ASC;

        return {
            filters,
            orderByObject,
            skip,
            take,
        };
    }
}
