import { Module } from "@nestjs/common";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";
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
    controllers: [MovieController],
    providers: [MovieService, PrismaService, JwtStrategy],
    exports: [MovieService],
})
export class MovieModule {}
