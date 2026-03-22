import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Req, Res, UseGuards } from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { ListService } from "./list.service";
import { CreateListDto, UpdateListDto, CreateListShareDto } from "./dtos/list.dto";
import { AddListItemDto } from "./dtos/list-item.dto";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Request, Response } from "express";

@Controller("lists")
export class ListController {
    constructor(private readonly listService: ListService) {}

    @Get()
    @UseGuards(AuthGuard)
    @Inertia("Lists/Index")
    async index(@Req() req: Request) {
        const lists = await this.listService.findAllByUser(req.session!.userId!);
        return { lists };
    }

    @Get("shared-with-me")
    @UseGuards(AuthGuard)
    @Inertia("Lists/SharedWithMe")
    async sharedWithMe(@Req() req: Request) {
        const lists = await this.listService.getSharedWithMe(req.session!.userId!);
        return { lists };
    }

    @Get(":id")
    @Inertia("Lists/Show")
    async show(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const list = await this.listService.findListById(id, userId);
        return { list };
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() dto: CreateListDto, @Req() req: Request, @Res() res: Response) {
        const list = await this.listService.createList(req.session!.userId!, dto);
        (req.session as any).flash = { type: "success", message: "List created." };
        return res.redirect(303, `/lists/${(list as any).id}`);
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateListDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.listService.updateList(id, req.session!.userId!, dto);
        (req.session as any).flash = { type: "success", message: "List updated." };
        return res.redirect(303, `/lists/${id}`);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async delete(@Param("id", ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        await this.listService.deleteList(id, req.session!.userId!);
        (req.session as any).flash = { type: "success", message: "List deleted." };
        return res.redirect(303, "/lists");
    }

    @Post(":id/movies")
    @UseGuards(AuthGuard)
    async addMovie(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: AddListItemDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.listService.addMovieToList(id, req.session!.userId!, dto);
        return res.redirect(303, `/lists/${id}`);
    }

    @Delete(":id/movies/:movieId")
    @UseGuards(AuthGuard)
    async removeMovie(
        @Param("id", ParseIntPipe) id: number,
        @Param("movieId", ParseIntPipe) movieId: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.listService.removeMovieFromList(id, movieId, req.session!.userId!);
        return res.redirect(303, `/lists/${id}`);
    }

    @Post(":id/series")
    @UseGuards(AuthGuard)
    async addSeries(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: AddListItemDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.listService.addSeriesToList(id, req.session!.userId!, dto);
        return res.redirect(303, `/lists/${id}`);
    }

    @Delete(":id/series/:serieId")
    @UseGuards(AuthGuard)
    async removeSeries(
        @Param("id", ParseIntPipe) id: number,
        @Param("serieId", ParseIntPipe) serieId: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.listService.removeSeriesFromList(id, serieId, req.session!.userId!);
        return res.redirect(303, `/lists/${id}`);
    }

    @Post(":id/share")
    @UseGuards(AuthGuard)
    async share(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: CreateListShareDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.listService.shareList(id, req.session!.userId!, dto);
        (req.session as any).flash = { type: "success", message: "List shared." };
        return res.redirect(303, `/lists/${id}`);
    }

    @Delete(":id/share/:userId")
    @UseGuards(AuthGuard)
    async unshare(
        @Param("id", ParseIntPipe) id: number,
        @Param("userId", ParseIntPipe) sharedUserId: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.listService.unshareList(id, req.session!.userId!, sharedUserId);
        (req.session as any).flash = { type: "success", message: "List unshared." };
        return res.redirect(303, `/lists/${id}`);
    }
}
