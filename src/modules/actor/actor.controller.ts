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
import { ActorService } from "./actor.service";
import { CreateActorDto } from "./dtos/create-actor.dto";
import { UpdateActorDto } from "./dtos/update-actor.dto";
import { ActorQueryDto } from "./dtos/actor-query.dto";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Request, Response } from "express";

@Controller("actors")
export class ActorController {
    constructor(private readonly actorService: ActorService) {}

    @Get()
    @Inertia("Actors/Index")
    async index(@Query() query: ActorQueryDto, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.actorService.findAll(query, userId);
        const perPage = Number(query.perPage ?? 12);
        const page = Number(query.page ?? 1);
        const pagination = {
            total: data.count,
            page,
            totalPages: Math.ceil(data.count / perPage),
            perPage,
        };
        return { actors: data.actors, pagination, filters: query };
    }

    @Get("search")
    @Inertia("Actors/Index")
    async search(
        @Query("fullname") fullname: string,
        @Query("page") page = 1,
        @Query("perPage") perPage = 12,
        @Req() req: Request,
    ) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.actorService.search(fullname, userId, Number(page), Number(perPage));
        return { actors: data.actors, count: data.count, searchQuery: fullname };
    }

    @Get(":id")
    @Inertia("Actors/Show")
    async show(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const actor = await this.actorService.findOne(id, userId);
        return { actor };
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() dto: CreateActorDto, @Req() req: Request, @Res() res: Response) {
        await this.actorService.create(dto);
        (req.session as any).flash = { type: "success", message: "Actor created." };
        return res.redirect(303, "/actors");
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateActorDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.actorService.update(id, dto);
        (req.session as any).flash = { type: "success", message: "Actor updated." };
        return res.redirect(303, `/actors/${id}`);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        await this.actorService.remove(id);
        (req.session as any).flash = { type: "success", message: "Actor deleted." };
        return res.redirect(303, "/actors");
    }
}
