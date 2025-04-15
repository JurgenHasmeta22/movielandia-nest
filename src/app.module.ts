import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { MovieModule } from "./modules/movie/movie.module";

@Module({
    imports: [MovieModule],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
