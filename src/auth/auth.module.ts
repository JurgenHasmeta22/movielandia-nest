import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./guards/jwt.strategy";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { EmailService } from "../email/email.service";
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
    controllers: [AuthController],
    providers: [AuthService, PrismaService, JwtStrategy, EmailService],
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
