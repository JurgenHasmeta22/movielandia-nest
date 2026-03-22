import { Controller, Get, Query } from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Inertia("Home")
    async home() {
        return await this.appService.getHomeData();
    }

    @Get("search")
    @Inertia("Search")
    async search(
        @Query("q") q = "",
        @Query("tab") tab = "all",
        @Query("page") page = 1,
        @Query("perPage") perPage = 12,
    ) {
        return await this.appService.search(q, tab, Number(page), Number(perPage));
    }
}
