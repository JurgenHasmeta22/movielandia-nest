import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";
import { SignUpDto, SignInDto, ForgotPasswordDto, ResetPasswordDto, ActivateAccountDto } from "./dtos/auth.dto";
import { randomBytes } from "crypto";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async signUp(signUpDto: SignUpDto) {
        const { email, password, userName } = signUpDto;

        const userExists = await this.prisma.user.findFirst({
            where: { OR: [{ email }, { userName }] },
        });

        if (userExists) {
            throw new ConflictException("User with this email or username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationToken = randomBytes(32).toString("hex");

        await this.prisma.$transaction(async (prisma) => {
            const newUser = await prisma.user.create({
                data: {
                    email,
                    userName,
                    password: hashedPassword,
                    active: false,
                },
            });

            await prisma.activateToken.create({
                data: {
                    token: activationToken,
                    userId: newUser.id,
                },
            });

            return newUser;
        });

        // TODO: Send activation email

        return { message: "User created successfully. Please check your email to activate your account." };
    }

    async signIn(signInDto: SignInDto) {
        const { email, password } = signInDto;

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // Check if user is active
        if (!user.active) {
            throw new UnauthorizedException("Please activate your account first");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // Generate JWT
        const payload = { id: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }

    async activateAccount(activateAccountDto: ActivateAccountDto) {
        const { token } = activateAccountDto;

        const activateToken = await this.prisma.activateToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!activateToken) {
            throw new NotFoundException("Invalid or expired activation token");
        }

        // Activate user and mark token as used in transaction
        await this.prisma.$transaction(async (prisma) => {
            await prisma.user.update({
                where: { id: activateToken.userId },
                data: { active: true },
            });

            await prisma.activateToken.update({
                where: { id: activateToken.id },
                data: { activatedAt: new Date() },
            });
        });

        return { message: "Account activated successfully" };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const { email } = forgotPasswordDto;

        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const resetToken = randomBytes(32).toString("hex");

        await this.prisma.resetPasswordToken.create({
            data: {
                token: resetToken,
                userId: user.id,
            },
        });

        // TODO: Send reset password email

        return { message: "Password reset instructions have been sent to your email" };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { token, password } = resetPasswordDto;

        const resetToken = await this.prisma.resetPasswordToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetToken) {
            throw new NotFoundException("Invalid or expired reset token");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.prisma.$transaction(async (prisma) => {
            await prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            });

            await prisma.resetPasswordToken.update({
                where: { id: resetToken.id },
                data: { resetPasswordAt: new Date() },
            });
        });

        return { message: "Password reset successfully" };
    }
}
