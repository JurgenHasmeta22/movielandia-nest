import { Controller, Get, Param, Query, ParseIntPipe, Req } from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { SerieService } from "./serie.service";
import { SerieQueryDto } from "./dtos/serie-query.dto";
import { Request } from "express";

@Controller("series")
export class SerieController {
    constructor(private readonly serieService: SerieService) {}

    @Get()
    @Inertia("Series/Index")
    async index(@Query() query: SerieQueryDto, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.serieService.findAll(query, userId);
        const page = query.page ?? 1;
        const perPage = query.perPage ?? 12;
        return {
            series: data.series,
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
    @Inertia("Series/Latest")
    async latest(@Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const series = await this.serieService.findLatest(userId);
        return { series };
    }

    @Get("search")
    @Inertia("Series/Index")
    async search(@Query("title") title: string, @Query() query: SerieQueryDto, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.serieService.search(title, query, userId);
        const page = query.page ?? 1;
        const perPage = query.perPage ?? 12;
        return {
            series: data.series,
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
    @Inertia("Series/Show")
    async show(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const serie = await this.serieService.findOne(id, userId);
        return { serie };
    }
}
