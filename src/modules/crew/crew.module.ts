import { Module } from "@nestjs/common";
import { CrewController } from "./crew.controller";
import { CrewService } from "./crew.service";
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
    controllers: [CrewController],
    providers: [CrewService, PrismaService, JwtStrategy],
    exports: [CrewService],
})
export class CrewModule {}
