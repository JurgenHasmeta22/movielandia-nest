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

    private imgUrl(src: string | null | undefined, dir: string): string | null {
        if (!src) return null;
        if (src.startsWith("http://") || src.startsWith("https://")) return src;
        return `/images/${dir}/${src}`;
    }

    async searchQuick(q: string, category = "all") {
        const term = q?.trim() ?? "";
        if (!term) return { results: [] };

        const results: any[] = [];
        const take = 5;

        if (category === "all" || category === "movies") {
            const movies = await this.prisma.movie.findMany({
                where: { title: { contains: term.toLowerCase() } },
                take,
                select: { id: true, title: true, photoSrc: true, description: true, dateAired: true },
                orderBy: { title: "asc" },
            });
            movies.forEach((m) =>
                results.push({
                    type: "movies",
                    id: m.id,
                    title: m.title,
                    photo: this.imgUrl(m.photoSrc, "movies"),
                    subtitle: "Movie",
                    description: m.description ? m.description.substring(0, 80) + "\u2026" : null,
                    year: m.dateAired ? new Date(m.dateAired).getFullYear() : null,
                    href: `/movies/${m.id}`,
                }),
            );
        }

        if (category === "all" || category === "series") {
            const series = await this.prisma.serie.findMany({
                where: { title: { contains: term.toLowerCase() } },
                take,
                select: { id: true, title: true, photoSrc: true, description: true, dateAired: true },
                orderBy: { title: "asc" },
            });
            series.forEach((s) =>
                results.push({
                    type: "series",
                    id: s.id,
                    title: s.title,
                    photo: this.imgUrl(s.photoSrc, "series"),
                    subtitle: "Series",
                    description: s.description ? s.description.substring(0, 80) + "\u2026" : null,
                    year: s.dateAired ? new Date(s.dateAired).getFullYear() : null,
                    href: `/series/${s.id}`,
                }),
            );
        }

        if (category === "all" || category === "actors") {
            const actors = await this.prisma.actor.findMany({
                where: { fullname: { contains: term.toLowerCase() } },
                take,
                select: { id: true, fullname: true, photoSrc: true },
                orderBy: { fullname: "asc" },
            });
            actors.forEach((a) =>
                results.push({
                    type: "actors",
                    id: a.id,
                    title: a.fullname,
                    photo: this.imgUrl(a.photoSrc, "actors"),
                    subtitle: "Actor",
                    year: null,
                    href: `/actors/${a.id}`,
                }),
            );
        }

        if (category === "all" || category === "crew") {
            const crew = await this.prisma.crew.findMany({
                where: { fullname: { contains: term.toLowerCase() } },
                take,
                select: { id: true, fullname: true, photoSrc: true, role: true },
                orderBy: { fullname: "asc" },
            });
            crew.forEach((c) =>
                results.push({
                    type: "crew",
                    id: c.id,
                    title: c.fullname,
                    photo: this.imgUrl(c.photoSrc, "crew"),
                    subtitle: c.role ?? "Crew",
                    year: null,
                    href: `/crew/${c.id}`,
                }),
            );
        }

        if (category === "all" || category === "seasons") {
            const seasons = await this.prisma.season.findMany({
                where: { title: { contains: term.toLowerCase() } },
                take,
                select: { id: true, title: true, photoSrc: true, description: true, dateAired: true },
                orderBy: { title: "asc" },
            });
            seasons.forEach((s) =>
                results.push({
                    type: "seasons",
                    id: s.id,
                    title: s.title,
                    photo: this.imgUrl(s.photoSrc, "seasons"),
                    subtitle: "Season",
                    description: s.description ? s.description.substring(0, 80) + "\u2026" : null,
                    year: s.dateAired ? new Date(s.dateAired).getFullYear() : null,
                    href: `/seasons/${s.id}`,
                }),
            );
        }

        if (category === "all" || category === "episodes") {
            const episodes = await this.prisma.episode.findMany({
                where: { title: { contains: term.toLowerCase() } },
                take,
                select: { id: true, title: true, photoSrc: true, description: true, dateAired: true },
                orderBy: { title: "asc" },
            });
            episodes.forEach((ep) =>
                results.push({
                    type: "episodes",
                    id: ep.id,
                    title: ep.title,
                    photo: this.imgUrl(ep.photoSrc, "episodes"),
                    subtitle: "Episode",
                    description: ep.description ? ep.description.substring(0, 80) + "\u2026" : null,
                    year: ep.dateAired ? new Date(ep.dateAired).getFullYear() : null,
                    href: `/episodes/${ep.id}`,
                }),
            );
        }

        if (category === "all" || category === "users") {
            const users = await this.prisma.user.findMany({
                where: { userName: { contains: term.toLowerCase() } },
                take,
                select: { id: true, userName: true, avatar: { select: { photoSrc: true } } },
                orderBy: { userName: "asc" },
            });
            users.forEach((u) =>
                results.push({
                    type: "users",
                    id: u.id,
                    title: u.userName,
                    photo: this.imgUrl(u.avatar?.photoSrc ?? null, "avatars"),
                    subtitle: "User",
                    year: null,
                    href: `/users/${u.id}`,
                }),
            );
        }

        return { results };
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
                this.prisma.movie.findMany({
                    where: titleFilter,
                    orderBy: { title: "asc" },
                    skip,
                    take: perPage,
                    select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true },
                }),
                this.prisma.movie.count({ where: titleFilter }),
            ]);
            return {
                movies: movies.map(mapMedia),
                moviesPagination: { total, page, totalPages: Math.ceil(total / perPage), perPage },
                tab,
                searchQuery: term,
            };
        }

        if (tab === "series") {
            const [series, total] = await Promise.all([
                this.prisma.serie.findMany({
                    where: titleFilter,
                    orderBy: { title: "asc" },
                    skip,
                    take: perPage,
                    select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true },
                }),
                this.prisma.serie.count({ where: titleFilter }),
            ]);
            return {
                series: series.map(mapMedia),
                seriesPagination: { total, page, totalPages: Math.ceil(total / perPage), perPage },
                tab,
                searchQuery: term,
            };
        }

        if (tab === "actors") {
            const [actors, total] = await Promise.all([
                this.prisma.actor.findMany({
                    where: fullnameFilter,
                    orderBy: { fullname: "asc" },
                    skip,
                    take: perPage,
                    select: { id: true, fullname: true, photoSrc: true, debut: true },
                }),
                this.prisma.actor.count({ where: fullnameFilter }),
            ]);
            return {
                actors: actors.map(mapPerson),
                actorsPagination: { total, page, totalPages: Math.ceil(total / perPage), perPage },
                tab,
                searchQuery: term,
            };
        }

        if (tab === "crew") {
            const [crew, total] = await Promise.all([
                this.prisma.crew.findMany({
                    where: fullnameFilter,
                    orderBy: { fullname: "asc" },
                    skip,
                    take: perPage,
                    select: { id: true, fullname: true, photoSrc: true, role: true, debut: true },
                }),
                this.prisma.crew.count({ where: fullnameFilter }),
            ]);
            return {
                crew: crew.map(mapPerson),
                crewPagination: { total, page, totalPages: Math.ceil(total / perPage), perPage },
                tab,
                searchQuery: term,
            };
        }

        if (tab === "seasons") {
            const [seasons, total] = await Promise.all([
                this.prisma.season.findMany({
                    where: titleFilter,
                    orderBy: { title: "asc" },
                    skip,
                    take: perPage,
                    select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true },
                }),
                this.prisma.season.count({ where: titleFilter }),
            ]);
            return {
                seasons: seasons.map(mapMedia),
                seasonsPagination: { total, page, totalPages: Math.ceil(total / perPage), perPage },
                tab,
                searchQuery: term,
            };
        }

        if (tab === "episodes") {
            const [episodes, total] = await Promise.all([
                this.prisma.episode.findMany({
                    where: titleFilter,
                    orderBy: { title: "asc" },
                    skip,
                    take: perPage,
                    select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true },
                }),
                this.prisma.episode.count({ where: titleFilter }),
            ]);
            return {
                episodes: episodes.map(mapMedia),
                episodesPagination: { total, page, totalPages: Math.ceil(total / perPage), perPage },
                tab,
                searchQuery: term,
            };
        }

        if (tab === "users") {
            const [users, total] = await Promise.all([
                this.prisma.user.findMany({
                    where: userFilter,
                    orderBy: { userName: "asc" },
                    skip,
                    take: perPage,
                    select: { id: true, userName: true, avatar: true, countryFrom: true },
                }),
                this.prisma.user.count({ where: userFilter }),
            ]);
            return {
                users: users.map(mapUser),
                usersPagination: { total, page, totalPages: Math.ceil(total / perPage), perPage },
                tab,
                searchQuery: term,
            };
        }

        // tab === "all" — preview of each category
        const [
            movies,
            moviesCount,
            series,
            seriesCount,
            actors,
            actorsCount,
            crew,
            crewCount,
            seasons,
            seasonsCount,
            episodes,
            episodesCount,
            users,
            usersCount,
        ] = await Promise.all([
            this.prisma.movie.findMany({
                where: titleFilter,
                orderBy: { title: "asc" },
                take: previewCount,
                select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true },
            }),
            this.prisma.movie.count({ where: titleFilter }),
            this.prisma.serie.findMany({
                where: titleFilter,
                orderBy: { title: "asc" },
                take: previewCount,
                select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true },
            }),
            this.prisma.serie.count({ where: titleFilter }),
            this.prisma.actor.findMany({
                where: fullnameFilter,
                orderBy: { fullname: "asc" },
                take: previewCount,
                select: { id: true, fullname: true, photoSrc: true, debut: true },
            }),
            this.prisma.actor.count({ where: fullnameFilter }),
            this.prisma.crew.findMany({
                where: fullnameFilter,
                orderBy: { fullname: "asc" },
                take: previewCount,
                select: { id: true, fullname: true, photoSrc: true, role: true, debut: true },
            }),
            this.prisma.crew.count({ where: fullnameFilter }),
            this.prisma.season.findMany({
                where: titleFilter,
                orderBy: { title: "asc" },
                take: previewCount,
                select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true },
            }),
            this.prisma.season.count({ where: titleFilter }),
            this.prisma.episode.findMany({
                where: titleFilter,
                orderBy: { title: "asc" },
                take: previewCount,
                select: { id: true, title: true, photoSrc: true, ratingImdb: true, dateAired: true },
            }),
            this.prisma.episode.count({ where: titleFilter }),
            this.prisma.user.findMany({
                where: userFilter,
                orderBy: { userName: "asc" },
                take: previewCount,
                select: { id: true, userName: true, avatar: true, countryFrom: true },
            }),
            this.prisma.user.count({ where: userFilter }),
        ]);

        return {
            movies: movies.map(mapMedia),
            series: series.map(mapMedia),
            actors: actors.map(mapPerson),
            crew: crew.map(mapPerson),
            seasons: seasons.map(mapMedia),
            episodes: episodes.map(mapMedia),
            users: users.map(mapUser),
            moviesPagination: {
                total: moviesCount,
                page: 1,
                totalPages: Math.ceil(moviesCount / previewCount),
                perPage: previewCount,
            },
            seriesPagination: {
                total: seriesCount,
                page: 1,
                totalPages: Math.ceil(seriesCount / previewCount),
                perPage: previewCount,
            },
            actorsPagination: {
                total: actorsCount,
                page: 1,
                totalPages: Math.ceil(actorsCount / previewCount),
                perPage: previewCount,
            },
            crewPagination: {
                total: crewCount,
                page: 1,
                totalPages: Math.ceil(crewCount / previewCount),
                perPage: previewCount,
            },
            seasonsPagination: {
                total: seasonsCount,
                page: 1,
                totalPages: Math.ceil(seasonsCount / previewCount),
                perPage: previewCount,
            },
            episodesPagination: {
                total: episodesCount,
                page: 1,
                totalPages: Math.ceil(episodesCount / previewCount),
                perPage: previewCount,
            },
            usersPagination: {
                total: usersCount,
                page: 1,
                totalPages: Math.ceil(usersCount / previewCount),
                perPage: previewCount,
            },
            tab,
            searchQuery: term,
        };
    }
}
