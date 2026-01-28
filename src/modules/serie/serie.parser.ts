import { SerieQueryDto, SortOrder } from "./dtos/serie-query.dto";
import { Prisma } from "@prisma/client";

export class SerieParser {
    static parseSerieQuery(query: SerieQueryDto): {
        filters: Prisma.SerieWhereInput;
        orderByObject: Prisma.SerieOrderByWithRelationInput;
        skip: number;
        take: number;
    } {
        const {
            sortBy,
            ascOrDesc = SortOrder.ASC,
            perPage = 12,
            page = 1,
            title,
            filterValue,
            filterNameString,
            filterOperatorString,
        } = query;

        const filters: Prisma.SerieWhereInput = {};
        const orderByObject: Prisma.SerieOrderByWithRelationInput = {};

        const skip = (page - 1) * perPage;
        const take = perPage;

        if (title) {
            filters.title = { contains: title.toLowerCase() };
        }

        if (filterValue !== undefined && filterNameString && filterOperatorString) {
            if (typeof filterValue === "string" && filterOperatorString === "contains") {
                filters[filterNameString] = { contains: filterValue.toLowerCase() };
            } else {
                const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
                filters[filterNameString] = { [operator]: Number(filterValue) };
            }
        }

        orderByObject[sortBy || "title"] = ascOrDesc || SortOrder.ASC;

        return {
            filters,
            orderByObject,
            skip,
            take,
        };
    }
}
