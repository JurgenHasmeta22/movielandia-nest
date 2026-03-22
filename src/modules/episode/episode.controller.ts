import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe, Req, Res, UseGuards } from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { EpisodeService } from "./episode.service";
import { CreateEpisodeDto } from "./dtos/create-episode.dto";
import { UpdateEpisodeDto } from "./dtos/update-episode.dto";
import { EpisodeQueryDto } from "./dtos/episode-query.dto";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Request, Response } from "express";

@Controller("episodes")
export class EpisodeController {
    constructor(private readonly episodeService: EpisodeService) {}

    @Get()
    @Inertia("Episodes/Index")
    async index(@Query() query: EpisodeQueryDto, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.episodeService.findAll(query, userId);
        return { episodes: data.episodes, count: data.count, filters: query };
    }

    @Get("search")
    @Inertia("Episodes/Index")
    async search(@Query("title") title: string, @Query("page") page = 1, @Query("perPage") perPage = 12, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.episodeService.search(title, userId, Number(page), Number(perPage));
        return { episodes: data.episodes, count: data.count, searchQuery: title };
    }

    @Get("season/:seasonId")
    @Inertia("Episodes/Index")
    async bySeason(@Param("seasonId", ParseIntPipe) seasonId: number, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.episodeService.findBySeasonId(seasonId, userId);
        return { episodes: data.episodes, count: data.count };
    }

    @Get(":id")
    @Inertia("Episodes/Show")
    async show(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const episode = await this.episodeService.findOne(id, userId);
        return { episode };
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() dto: CreateEpisodeDto, @Req() req: Request, @Res() res: Response) {
        await this.episodeService.create(dto);
        (req.session as any).flash = { type: "success", message: "Episode created." };
        return res.redirect(303, "/episodes");
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    async update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateEpisodeDto, @Req() req: Request, @Res() res: Response) {
        await this.episodeService.update(id, dto);
        (req.session as any).flash = { type: "success", message: "Episode updated." };
        return res.redirect(303, `/episodes/${id}`);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async delete(@Param("id", ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        await this.episodeService.delete(id);
        (req.session as any).flash = { type: "success", message: "Episode deleted." };
        return res.redirect(303, "/episodes");
    }
}

