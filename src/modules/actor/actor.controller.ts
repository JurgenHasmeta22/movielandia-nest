import { Controller, Get, Param, Query, ParseIntPipe, Req } from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { ActorService } from "./actor.service";
import { ActorQueryDto } from "./dtos/actor-query.dto";
import { Request } from "express";

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
}
