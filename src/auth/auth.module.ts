import { Global, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { EmailService } from "../email/email.service";
import { AuthGuard } from "./guards/auth.guard";
import { OptionalAuthGuard } from "./guards/optional-auth.guard";

@Global()
@Module({
    controllers: [AuthController],
    providers: [AuthService, EmailService, AuthGuard, OptionalAuthGuard],
    exports: [AuthService, AuthGuard, OptionalAuthGuard],
})
export class AuthModule {}

