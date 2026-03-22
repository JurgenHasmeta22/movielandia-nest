import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    ParseIntPipe,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { GenreService } from "./genre.service";
import { CreateGenreDto } from "./dtos/create-genre.dto";
import { UpdateGenreDto } from "./dtos/update-genre.dto";
import { GenreQueryDto } from "./dtos/genre-query.dto";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Request, Response } from "express";

@Controller("genres")
export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    @Get()
    @Inertia("Genres/Index")
    async index(@Query() query: GenreQueryDto, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.genreService.findAll(query, userId);
        const page = query.page ?? 1;
        const perPage = query.perPage ?? 20;
        return {
            genres: data.genres,
            pagination: {
                total: data.count ?? 0,
                page,
                totalPages: Math.ceil((data.count ?? 0) / perPage),
                perPage,
            },
            filters: query,
        };
    }

    @Get("search")
    @Inertia("Genres/Index")
    async search(
        @Query("name") name: string,
        @Query("page") page = 1,
        @Query("perPage") perPage = 20,
        @Req() req: Request,
    ) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.genreService.search(name, userId, Number(page), Number(perPage));
        return { genres: data.genres, count: data.count, searchQuery: name };
    }

    @Get(":id")
    @Inertia("Genres/Show")
    async show(
        @Param("id", ParseIntPipe) id: number,
        @Query("moviesPage") moviesPage = 1,
        @Query("seriesPage") seriesPage = 1,
        @Query("perPage") perPage = 12,
        @Query("sortBy") sortBy = "title",
        @Query("ascOrDesc") ascOrDesc: "asc" | "desc" = "asc",
        @Req() req: Request,
    ) {
        const userId: number | undefined = req.session?.userId;
        const genre = await this.genreService.findOne(
            id,
            userId,
            Number(moviesPage),
            Number(seriesPage),
            Number(perPage),
            sortBy,
            ascOrDesc,
        );
        return { genre, filters: { sortBy, ascOrDesc, perPage: Number(perPage) } };
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() dto: CreateGenreDto, @Req() req: Request, @Res() res: Response) {
        await this.genreService.create(dto);
        (req.session as any).flash = { type: "success", message: "Genre created." };
        return res.redirect(303, "/genres");
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateGenreDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.genreService.update(id, dto);
        (req.session as any).flash = { type: "success", message: "Genre updated." };
        return res.redirect(303, `/genres/${id}`);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        await this.genreService.remove(id);
        (req.session as any).flash = { type: "success", message: "Genre deleted." };
        return res.redirect(303, "/genres");
    }
}
