import { Controller, Get, Param, Query, ParseIntPipe, Req } from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { CrewService } from "./crew.service";
import { CrewQueryDto } from "./dtos/crew-query.dto";
import { Request } from "express";

@Controller("crew")
export class CrewController {
    constructor(private readonly crewService: CrewService) {}

    @Get()
    @Inertia("Crew/Index")
    async index(@Query() query: CrewQueryDto, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.crewService.findAll(query, userId);
        const perPage = Number(query.perPage ?? 12);
        const page = Number(query.page ?? 1);
        const pagination = {
            total: data.count,
            page,
            totalPages: Math.ceil(data.count / perPage),
            perPage,
        };

        return { crew: data.crew, pagination, filters: query };
    }

    @Get("search")
    @Inertia("Crew/Index")
    async search(
        @Query("fullname") fullname: string,
        @Query("page") page = 1,
        @Query("perPage") perPage = 12,
        @Req() req: Request,
    ) {
        const userId: number | undefined = req.session?.userId;
        const data = await this.crewService.search(fullname, userId, Number(page), Number(perPage));

        return { crew: data.crew, count: data.count, searchQuery: fullname };
    }

    @Get(":id")
    @Inertia("Crew/Show")
    async show(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
        const userId: number | undefined = req.session?.userId;
        const member = await this.crewService.findOne(id, userId);

        return { member };
    }
}
