import { Module } from "@nestjs/common";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";
import { PrismaService } from "@/prisma.service";
import { JwtStrategy } from "@/guards/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            secret: process.env.NEXTAUTH_SECRET,
            signOptions: { expiresIn: "1d" },
        }),
    ],
    controllers: [MovieController],
    providers: [MovieService, PrismaService, JwtStrategy],
    exports: [MovieService],
})
export class MovieModule {}
