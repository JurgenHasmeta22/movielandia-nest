import { Controller, Get, Post, Body, Req, Res, HttpCode, HttpStatus, BadRequestException } from "@nestjs/common";
import { Inertia } from "inertia-nestjs";
import { AuthService } from "./auth.service";
import { SignUpDto, SignInDto, ForgotPasswordDto, ResetPasswordDto, ActivateAccountDto } from "./dtos/auth.dto";
import { Request, Response } from "express";

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    // ─── Sign In ────────────────────────────────────────────────────────────

    @Get("login")
    @Inertia("Auth/Login")
    loginPage() {
        return {};
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: SignInDto, @Req() req: Request, @Res() res: Response) {
        try {
            const userId = await this.authService.validateCredentials(dto.emailOrUsername, dto.password);
            req.session.userId = userId;
            return res.redirect(303, "/");
        } catch {
            (req.session as any).flash = { type: "error", message: "Invalid credentials" };
            return res.redirect(303, "/login");
        }
    }

    // ─── Register ───────────────────────────────────────────────────────────

    @Get("register")
    @Inertia("Auth/Register")
    registerPage() {
        return {};
    }

    @Post("register")
    async register(@Body() dto: SignUpDto, @Req() req: Request, @Res() res: Response) {
        try {
            await this.authService.signUp(dto);
            (req.session as any).flash = {
                type: "success",
                message: "Account created! Check your email to activate it.",
            };
            return res.redirect(303, "/login");
        } catch (err: any) {
            (req.session as any).flash = { type: "error", message: err.message ?? "Registration failed" };
            return res.redirect(303, "/register");
        }
    }

    // ─── Logout ─────────────────────────────────────────────────────────────

    @Post("logout")
    async logout(@Req() req: Request, @Res() res: Response) {
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.redirect(303, "/login");
        });
    }

    // ─── Activate account ───────────────────────────────────────────────────

    @Get("activate")
    @Inertia("Auth/Activate")
    activatePage() {
        return {};
    }

    @Post("activate")
    async activateAccount(@Body() dto: ActivateAccountDto, @Req() req: Request, @Res() res: Response) {
        try {
            await this.authService.activateAccount(dto);
            (req.session as any).flash = { type: "success", message: "Account activated! You can now log in." };
        } catch {
            (req.session as any).flash = { type: "error", message: "Invalid or expired activation token." };
        }
        return res.redirect(303, "/login");
    }

    // ─── Forgot / Reset password ─────────────────────────────────────────────

    @Get("forgot-password")
    @Inertia("Auth/ForgotPassword")
    forgotPasswordPage() {
        return {};
    }

    @Post("forgot-password")
    async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request, @Res() res: Response) {
        try {
            await this.authService.forgotPassword(dto);
            (req.session as any).flash = { type: "success", message: "Password reset link sent to your email." };
        } catch {
            (req.session as any).flash = { type: "error", message: "Could not send reset email." };
        }
        return res.redirect(303, "/forgot-password");
    }

    @Get("reset-password")
    @Inertia("Auth/ResetPassword")
    resetPasswordPage(@Req() req: Request) {
        return { token: req.query.token ?? "" };
    }

    @Post("reset-password")
    async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request, @Res() res: Response) {
        try {
            await this.authService.resetPassword(dto);
            (req.session as any).flash = { type: "success", message: "Password reset successfully!" };
            return res.redirect(303, "/login");
        } catch {
            (req.session as any).flash = { type: "error", message: "Invalid or expired reset token." };
            return res.redirect(303, `/reset-password?token=${dto.token}`);
        }
    }
}
