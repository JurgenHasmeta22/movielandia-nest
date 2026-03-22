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

    async search(q: string, tab = "all", page = 1, perPage = 12) {
        const term = q?.trim() ?? "";
        const skip = (page - 1) * perPage;
        const previewCount = 6;

        const titleFilter = term ? { title: { contains: term.toLowerCase() } } : {};
        const fullnameFilter = term ? { fullname: { contains: term.toLowerCase() } } : {};
        const userFilter = term ? { userName: { contains: term.toLowerCase() } } : {};

        const mapMedia = (item: any) => ({
            ...item,
            releaseYear: item.dateAired ? new Date(item.dateAired).getFullYear() : null,
        });
        const mapPerson = (item: any) => item;
        const mapUser = (item: any) => item;

        if (tab === "movies") {
            const [movies, total] = await Promise.all([
                this.prisma.movie.findMany({ where: titleFilter, orderBy: { title: "asc" }, skip, take: perPage, select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true } }),
                this.prisma.movie.count({ where: titleFilter }),
            ]);
            return { movies: movies.map(mapMedia), moviesPagination: { total, page, totalPages: Math.ceil(total / perPage), perPage }, tab };
        }

        if (tab === "series") {
            const [series, total] = await Promise.all([
                this.prisma.serie.findMany({ where: titleFilter, orderBy: { title: "asc" }, skip, take: perPage, select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true } }),
                this.prisma.serie.count({ where: titleFilter }),
            ]);
            return { series: series.map(mapMedia), seriesPagination: { total, page, totalPages: Math.ceil(total / perPage), perPage }, tab };
        }

        if (tab === "actors") {
            const [actors, total] = await Promise.all([
                this.prisma.actor.findMany({ where: fullnameFilter, orderBy: { fullname: "asc" }, skip, take: perPage, select: { id: true, fullname: true, photoSrc: true, debut: true } }),
                this.prisma.actor.count({ where: fullnameFilter }),
            ]);
            return { actors: actors.map(mapPerson), actorsPagination: { total, page, totalPages: Math.ceil(total / perPage), perPage }, tab };
        }

        if (tab === "crew") {
            const [crew, total] = await Promise.all([
                this.prisma.crew.findMany({ where: fullnameFilter, orderBy: { fullname: "asc" }, skip, take: perPage, select: { id: true, fullname: true, photoSrc: true, role: true, debut: true } }),
                this.prisma.crew.count({ where: fullnameFilter }),
            ]);
            return { crew: crew.map(mapPerson), crewPagination: { total, page, totalPages: Math.ceil(total / perPage), perPage }, tab };
        }

        if (tab === "users") {
            const [users, total] = await Promise.all([
                this.prisma.user.findMany({ where: userFilter, orderBy: { userName: "asc" }, skip, take: perPage, select: { id: true, userName: true, avatar: true, countryFrom: true } }),
                this.prisma.user.count({ where: userFilter }),
            ]);
            return { users: users.map(mapUser), usersPagination: { total, page, totalPages: Math.ceil(total / perPage), perPage }, tab };
        }

        // tab === "all" — preview of each category
        const [movies, moviesCount, series, seriesCount, actors, actorsCount, crew, crewCount, users, usersCount] = await Promise.all([
            this.prisma.movie.findMany({ where: titleFilter, orderBy: { title: "asc" }, take: previewCount, select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true } }),
            this.prisma.movie.count({ where: titleFilter }),
            this.prisma.serie.findMany({ where: titleFilter, orderBy: { title: "asc" }, take: previewCount, select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true } }),
            this.prisma.serie.count({ where: titleFilter }),
            this.prisma.actor.findMany({ where: fullnameFilter, orderBy: { fullname: "asc" }, take: previewCount, select: { id: true, fullname: true, photoSrc: true, debut: true } }),
            this.prisma.actor.count({ where: fullnameFilter }),
            this.prisma.crew.findMany({ where: fullnameFilter, orderBy: { fullname: "asc" }, take: previewCount, select: { id: true, fullname: true, photoSrc: true, role: true, debut: true } }),
            this.prisma.crew.count({ where: fullnameFilter }),
            this.prisma.user.findMany({ where: userFilter, orderBy: { userName: "asc" }, take: previewCount, select: { id: true, userName: true, avatar: true, countryFrom: true } }),
            this.prisma.user.count({ where: userFilter }),
        ]);

        return {
            movies: movies.map(mapMedia),
            series: series.map(mapMedia),
            actors: actors.map(mapPerson),
            crew: crew.map(mapPerson),
            users: users.map(mapUser),
            moviesPagination: { total: moviesCount, page: 1, totalPages: Math.ceil(moviesCount / previewCount), perPage: previewCount },
            seriesPagination: { total: seriesCount, page: 1, totalPages: Math.ceil(seriesCount / previewCount), perPage: previewCount },
            actorsPagination: { total: actorsCount, page: 1, totalPages: Math.ceil(actorsCount / previewCount), perPage: previewCount },
            crewPagination: { total: crewCount, page: 1, totalPages: Math.ceil(crewCount / previewCount), perPage: previewCount },
            usersPagination: { total: usersCount, page: 1, totalPages: Math.ceil(usersCount / previewCount), perPage: previewCount },
            tab,
        };
    }
}
