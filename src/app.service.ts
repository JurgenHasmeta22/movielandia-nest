import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AppService {
    constructor(private readonly prisma: PrismaService) {}

    async getHomeData() {
        const [latestMovies, latestSeries, genres] = await Promise.all([
            this.prisma.movie.findMany({
                orderBy: { dateAired: "desc" },
                take: 12,
                select: { id: true, title: true, photoSrc: true, ratingImdb: true },
            }),
            this.prisma.serie.findMany({
                orderBy: { dateAired: "desc" },
                take: 12,
                select: { id: true, title: true, photoSrc: true, ratingImdb: true },
            }),
            this.prisma.genre.findMany({
                take: 10,
                select: { id: true, name: true, _count: { select: { movies: true, series: true } } },
            }),
        ]);
        return { latestMovies, latestSeries, genres };
    }

    async search(q: string, page = 1, perPage = 12) {
        const term = q?.trim() ?? "";
        const skip = (page - 1) * perPage;

        const [movies, moviesCount, series, seriesCount] = await Promise.all([
            this.prisma.movie.findMany({
                where: term ? { title: { contains: term.toLowerCase() } } : {},
                orderBy: { title: "asc" },
                skip,
                take: perPage,
                select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true },
            }),
            this.prisma.movie.count({
                where: term ? { title: { contains: term.toLowerCase() } } : {},
            }),
            this.prisma.serie.findMany({
                where: term ? { title: { contains: term.toLowerCase() } } : {},
                orderBy: { title: "asc" },
                skip,
                take: perPage,
                select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true },
            }),
            this.prisma.serie.count({
                where: term ? { title: { contains: term.toLowerCase() } } : {},
            }),
        ]);

        const mapItem = (item: any) => ({
            ...item,
            releaseYear: item.dateAired ? new Date(item.dateAired).getFullYear() : null,
        });

        return {
            movies: movies.map(mapItem),
            series: series.map(mapItem),
            moviesPagination: {
                total: moviesCount,
                page,
                totalPages: Math.ceil(moviesCount / perPage),
                perPage,
            },
            seriesPagination: {
                total: seriesCount,
                page,
                totalPages: Math.ceil(seriesCount / perPage),
                perPage,
            },
        };
    }
}
