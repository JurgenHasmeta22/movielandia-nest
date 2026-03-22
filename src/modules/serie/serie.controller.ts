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
import { SerieService } from "./serie.service";
import { CreateSerieDto } from "./dtos/create-serie.dto";
import { UpdateSerieDto } from "./dtos/update-serie.dto";
import { SerieQueryDto } from "./dtos/serie-query.dto";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Request, Response } from "express";

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

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() dto: CreateSerieDto, @Req() req: Request, @Res() res: Response) {
        await this.serieService.create(dto);
        (req.session as any).flash = { type: "success", message: "Series created successfully." };
        return res.redirect(303, "/series");
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateSerieDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.serieService.update(id, dto);
        (req.session as any).flash = { type: "success", message: "Series updated successfully." };
        return res.redirect(303, `/series/${id}`);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        await this.serieService.remove(id);
        (req.session as any).flash = { type: "success", message: "Series deleted." };
        return res.redirect(303, "/series");
    }
}
