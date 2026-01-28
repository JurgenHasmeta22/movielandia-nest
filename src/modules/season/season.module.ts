import { Module } from "@nestjs/common";
import { SeasonController } from "./season.controller";
import { SeasonService } from "./season.service";
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
    controllers: [SeasonController],
    providers: [SeasonService, PrismaService, JwtStrategy],
    exports: [SeasonService],
})
export class SeasonModule {}
