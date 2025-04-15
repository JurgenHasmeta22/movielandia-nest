import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto, SignInDto, ForgotPasswordDto, ResetPasswordDto, ActivateAccountDto } from "./dtos/auth.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("signup")
    signup(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @Post("signin")
    @HttpCode(HttpStatus.OK)
    signin(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @Post("activate")
    @HttpCode(HttpStatus.OK)
    activateAccount(@Body() activateAccountDto: ActivateAccountDto) {
        return this.authService.activateAccount(activateAccountDto);
    }

    @Post("forgot-password")
    @HttpCode(HttpStatus.OK)
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post("reset-password")
    @HttpCode(HttpStatus.OK)
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}
