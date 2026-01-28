import { Module } from "@nestjs/common";
import { GenreController } from "./genre.controller";
import { GenreService } from "./genre.service";
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
    controllers: [GenreController],
    providers: [GenreService, PrismaService, JwtStrategy],
    exports: [GenreService],
})
export class GenreModule {}
