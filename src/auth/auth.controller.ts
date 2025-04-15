import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
    SignUpDto,
    SignInDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    ActivateAccountDto,
    TokenResponse,
} from "./dtos/auth.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("signup")
    @ApiOperation({ summary: "Register a new user" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "User successfully created" })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: "User already exists" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input" })
    signup(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @Post("signin")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Login with email and password" })
    @ApiResponse({ status: HttpStatus.OK, description: "Login successful", type: TokenResponse })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Invalid credentials" })
    signin(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @Post("activate")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Activate user account" })
    @ApiResponse({ status: HttpStatus.OK, description: "Account activated successfully" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Invalid or expired activation token" })
    activateAccount(@Body() activateAccountDto: ActivateAccountDto) {
        return this.authService.activateAccount(activateAccountDto);
    }

    @Post("forgot-password")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Request password reset" })
    @ApiResponse({ status: HttpStatus.OK, description: "Password reset instructions sent" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post("reset-password")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Reset password with token" })
    @ApiResponse({ status: HttpStatus.OK, description: "Password reset successful" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Invalid or expired reset token" })
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}
