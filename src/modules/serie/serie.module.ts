import { Module } from "@nestjs/common";
import { SerieController } from "./serie.controller";
import { SerieService } from "./serie.service";

@Module({
    controllers: [SerieController],
    providers: [SerieService],
    exports: [SerieService],
})
export class SerieModule {}
