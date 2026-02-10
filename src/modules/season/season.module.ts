import { Module } from "@nestjs/common";
import { SeasonController } from "./season.controller";
import { SeasonService } from "./season.service";
import { PrismaService } from "../../prisma.service";
import { JwtStrategy } from "../../auth/guards/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("AUTH_SECRET"),
                signOptions: { expiresIn: "1d" },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [SeasonController],
    providers: [SeasonService, PrismaService, JwtStrategy],
    exports: [SeasonService],
})
export class SeasonModule {}
