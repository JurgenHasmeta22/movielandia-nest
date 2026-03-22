import { Controller, Get } from "@nestjs/common";
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
}
