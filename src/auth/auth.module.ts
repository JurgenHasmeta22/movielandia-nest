import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./guards/jwt.strategy";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { EmailService } from "../email/email.service";
import { ConfigService } from "@nestjs/config";

/**
 * AuthModule is @Global so JwtModule, PassportModule and JwtStrategy are
 * available in every feature module without needing to be imported again.
 * PrismaService is injected via the global PrismaModule.
 */
@Global()
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
    providers: [AuthService, JwtStrategy, EmailService],
    exports: [JwtStrategy, PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
