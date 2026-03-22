import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe, Req, Res, UseGuards } from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { MovieService } from "./movie.service";
import { CreateMovieDto } from "./dtos/create-movie.dto";
import { UpdateMovieDto } from "./dtos/update-movie.dto";
import { MovieQueryDto } from "./dtos/movie-query.dto";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Request, Response } from "express";

@Controller("movies")
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get()
    @Inertia("Movies/Index")
    async index(@Query() query: MovieQueryDto, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.movieService.findAll(query, userId);
        return { movies: data.movies, count: data.count, filters: query };
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
        return { movies: data.movies, count: data.count, filters: query, searchQuery: title };
    }

    @Get(":id")
    @Inertia("Movies/Show")
    async show(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const movie = await this.movieService.findOne(id, userId);
        return { movie };
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() dto: CreateMovieDto, @Req() req: Request, @Res() res: Response) {
        await this.movieService.create(dto);
        (req.session as any).flash = { type: "success", message: "Movie created successfully." };
        return res.redirect(303, "/movies");
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    async update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateMovieDto, @Req() req: Request, @Res() res: Response) {
        await this.movieService.update(id, dto);
        (req.session as any).flash = { type: "success", message: "Movie updated successfully." };
        return res.redirect(303, `/movies/${id}`);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        await this.movieService.remove(id);
        (req.session as any).flash = { type: "success", message: "Movie deleted." };
        return res.redirect(303, "/movies");
    }
}

