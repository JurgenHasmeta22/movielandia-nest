import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { InertiaModule } from "inertia-nestjs";
import { readFileSync } from "fs";
import { join } from "path";
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
import { InertiaShareMiddleware } from "./inertia/inertia-share.middleware";

function assetVersion(): string {
    try {
        return readFileSync(join(process.cwd(), "public/build/app.js")).length.toString();
    } catch {
        return "1.0.0";
    }
}

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        AuthModule,
        InertiaModule.forRoot({
            rootView: "app",
            version: assetVersion,
            ssr: {
                enabled: false,
                url: "http://127.0.0.1:13714",
                bundlePath: "bootstrap/ssr/ssr.js",
            },
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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(InertiaShareMiddleware).forRoutes("*");
    }
}
