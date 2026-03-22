import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma.module";
import { AuthModule } from "./auth/auth.module";
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

@Module({
    imports: [
        // Core — must be first so every subsequent module can use ConfigService & PrismaService
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,   // @Global — provides PrismaService everywhere
        AuthModule,     // @Global — provides JwtModule, PassportModule, JwtStrategy everywhere

        // Feature modules
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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
