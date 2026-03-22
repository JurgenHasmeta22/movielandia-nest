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
import { CrewService } from "./crew.service";
import { CreateCrewDto } from "./dtos/create-crew.dto";
import { UpdateCrewDto } from "./dtos/update-crew.dto";
import { CrewQueryDto } from "./dtos/crew-query.dto";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Request, Response } from "express";

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

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() dto: CreateCrewDto, @Req() req: Request, @Res() res: Response) {
        await this.crewService.create(dto);
        (req.session as any).flash = { type: "success", message: "Crew member created." };
        return res.redirect(303, "/crew");
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateCrewDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.crewService.update(id, dto);
        (req.session as any).flash = { type: "success", message: "Crew member updated." };
        return res.redirect(303, `/crew/${id}`);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        await this.crewService.remove(id);
        (req.session as any).flash = { type: "success", message: "Crew member deleted." };
        return res.redirect(303, "/crew");
    }
}
