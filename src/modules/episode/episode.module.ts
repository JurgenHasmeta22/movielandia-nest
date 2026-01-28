import { Module } from "@nestjs/common";
import { EpisodeController } from "./episode.controller";
import { EpisodeService } from "./episode.service";
import { PrismaService } from "../../prisma.service";
import { JwtStrategy } from "../../auth/guards/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            secret: process.env.AUTH_SECRET,
            signOptions: { expiresIn: "1d" },
        }),
    ],
    controllers: [EpisodeController],
    providers: [EpisodeService, PrismaService, JwtStrategy],
    exports: [EpisodeService],
})
export class EpisodeModule {}
