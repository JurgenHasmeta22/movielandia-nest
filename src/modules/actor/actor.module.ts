import { Module } from "@nestjs/common";
import { ActorController } from "./actor.controller";
import { ActorService } from "./actor.service";
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
    controllers: [ActorController],
    providers: [ActorService, PrismaService, JwtStrategy],
    exports: [ActorService],
})
export class ActorModule {}
