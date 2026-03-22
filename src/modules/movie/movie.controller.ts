import { Controller, Get, Param, Query, ParseIntPipe, Req } from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { MovieService } from "./movie.service";
import { MovieQueryDto } from "./dtos/movie-query.dto";
import { Request } from "express";

@Controller("movies")
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get()
    @Inertia("Movies/Index")
    async index(@Query() query: MovieQueryDto, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.movieService.findAll(query, userId);
        const page = query.page ?? 1;
        const perPage = query.perPage ?? 12;

        return {
            movies: data.movies,
            pagination: {
                total: data.count,
                page,
                totalPages: Math.ceil(data.count / perPage),
                perPage,
            },
            filters: query,
        };
    }

    @Get("latest")
    @Inertia("Movies/Latest")
    async latest(@Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const movies = await this.movieService.findLatest(userId);

        return { movies };
    }

    @Get("search")
    @Inertia("Movies/Index")
    async search(@Query("title") title: string, @Query() query: MovieQueryDto, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.movieService.search(title, query, userId);
        const page = query.page ?? 1;
        const perPage = query.perPage ?? 12;

        return {
            movies: data.movies,
            pagination: {
                total: data.count,
                page,
                totalPages: Math.ceil(data.count / perPage),
                perPage,
            },
            filters: query,
            searchQuery: title,
        };
    }

    @Get(":id")
    @Inertia("Movies/Show")
    async show(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const movie = await this.movieService.findOne(id, userId);

        return { movie };
    }
}
