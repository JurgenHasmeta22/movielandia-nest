import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe, Req, Res, UseGuards } from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { SeasonService } from "./season.service";
import { CreateSeasonDto } from "./dtos/create-season.dto";
import { UpdateSeasonDto } from "./dtos/update-season.dto";
import { SeasonQueryDto } from "./dtos/season-query.dto";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Request, Response } from "express";

@Controller("seasons")
export class SeasonController {
    constructor(private readonly seasonService: SeasonService) {}

    @Get()
    @Inertia("Seasons/Index")
    async index(@Query() query: SeasonQueryDto, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.seasonService.findAll(query, userId);
        return { seasons: data.seasons, count: data.count, filters: query };
    }

    @Get("search")
    @Inertia("Seasons/Index")
    async search(@Query("title") title: string, @Query("page") page = 1, @Query("perPage") perPage = 12, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.seasonService.search(title, userId, Number(page), Number(perPage));
        return { seasons: data.seasons, count: data.count, searchQuery: title };
    }

    @Get("serie/:serieId")
    @Inertia("Seasons/Index")
    async bySerie(@Param("serieId", ParseIntPipe) serieId: number, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.seasonService.findBySerieId(serieId, userId);
        return { seasons: data.seasons, count: data.count };
    }

    @Get(":id")
    @Inertia("Seasons/Show")
    async show(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const season = await this.seasonService.findOne(id, userId);
        return { season };
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() dto: CreateSeasonDto, @Req() req: Request, @Res() res: Response) {
        await this.seasonService.create(dto);
        (req.session as any).flash = { type: "success", message: "Season created." };
        return res.redirect(303, "/seasons");
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    async update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateSeasonDto, @Req() req: Request, @Res() res: Response) {
        await this.seasonService.update(id, dto);
        (req.session as any).flash = { type: "success", message: "Season updated." };
        return res.redirect(303, `/seasons/${id}`);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async delete(@Param("id", ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        await this.seasonService.delete(id);
        (req.session as any).flash = { type: "success", message: "Season deleted." };
        return res.redirect(303, "/seasons");
    }
}

