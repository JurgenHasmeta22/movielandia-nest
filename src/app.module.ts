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
import { ForumModule } from "./modules/forum/forum.module";
import { ListModule } from "./modules/list/list.module";
import { ReviewModule } from "./modules/review/review.module";
import { UserModule } from "./modules/user/user.module";
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
        ForumModule,
        ListModule,
        ReviewModule,
        UserModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
