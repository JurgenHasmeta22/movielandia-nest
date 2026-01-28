import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { MovieModule } from "./modules/movie/movie.module";
import { SerieModule } from "./modules/serie/serie.module";
import { SeasonModule } from "./modules/season/season.module";
import { EpisodeModule } from "./modules/episode/episode.module";
import { GenreModule } from "./modules/genre/genre.module";
import { ActorModule } from "./modules/actor/actor.module";
import { CrewModule } from "./modules/crew/crew.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MovieModule,
        SerieModule,
        SeasonModule,
        EpisodeModule,
        GenreModule,
        ActorModule,
        CrewModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
