import { Module } from "@nestjs/common";
import { SerieController } from "./serie.controller";
import { SerieService } from "./serie.service";
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
    controllers: [SerieController],
    providers: [SerieService, PrismaService, JwtStrategy],
    exports: [SerieService],
})
export class SerieModule {}
