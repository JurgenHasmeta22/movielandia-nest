import { SeasonQueryDto } from "./dtos/season-query.dto";
import { BadRequestException } from "@nestjs/common";

export class SeasonParser {
    static parseSeasonQuery(query: SeasonQueryDto) {
        const page = Math.max(1, query.page || 1);
        const pageSize = Math.min(Math.max(1, query.pageSize || 10), 100);
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const filters: any = {};

        if (query.serieId) {
            filters.serieId = parseInt(query.serieId as any);
        }

        if (query.search) {
            filters.OR = [
                { title: { contains: query.search, mode: "insensitive" } },
                { description: { contains: query.search, mode: "insensitive" } },
            ];
        }

        if (query.minRating !== undefined && query.maxRating !== undefined) {
            const minRating = parseFloat(query.minRating as any);
            const maxRating = parseFloat(query.maxRating as any);

            if (minRating < 0 || maxRating > 10 || minRating > maxRating) {
                throw new BadRequestException("Rating must be between 0 and 10, and minRating must be less than maxRating");
            }

            filters.ratingImdb = {
                gte: minRating,
                lte: maxRating,
            };
        }

        const orderByObject: any = {};

        if (query.sortBy === "rating") {
            orderByObject.ratingImdb = query.sortOrder || "desc";
        } else if (query.sortBy === "date") {
            orderByObject.dateAired = query.sortOrder || "desc";
        } else if (query.sortBy === "title") {
            orderByObject.title = query.sortOrder || "asc";
        } else {
            orderByObject.id = "desc";
        }

        return { filters, orderByObject, skip, take };
    }
}
