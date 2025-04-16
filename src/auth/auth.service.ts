import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";
import { SignUpDto, SignInDto, ForgotPasswordDto, ResetPasswordDto, ActivateAccountDto } from "./dtos/auth.dto";
import { randomBytes } from "crypto";
import { EmailService } from "../email/email.service";
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/error.util";
import { isValidEmail } from "../utils/validation.util";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) {}

    async signUp(signUpDto: SignUpDto) {
        const { email, password, userName } = signUpDto;

        if (!isValidEmail(email)) {
            throw new UnauthorizedError("Invalid email format");
        }

        const userExists = await this.prisma.user.findFirst({
            where: { OR: [{ email }, { userName }] },
        });

        if (userExists) {
            throw new ConflictError("User with this email or username already exists");
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

        await this.emailService.sendActivationEmail(email, userName, activationToken);

        return { message: "User created successfully. Please check your email to activate your account." };
    }

    async signIn(signInDto: SignInDto) {
        const { email, password } = signInDto;

        if (!isValidEmail(email)) {
            throw new UnauthorizedError("Invalid email format");
        }

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        if (!user.active) {
            throw new UnauthorizedError("Please activate your account first");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid credentials");
        }

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
            throw new NotFoundError("Activation token");
        }

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

        if (!isValidEmail(email)) {
            throw new UnauthorizedError("Invalid email format");
        }

        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new NotFoundError("User");
        }

        const resetToken = randomBytes(32).toString("hex");

        await this.prisma.resetPasswordToken.create({
            data: {
                token: resetToken,
                userId: user.id,
            },
        });

        await this.emailService.sendPasswordResetEmail(email, user.userName, resetToken);

        return { message: "Password reset instructions have been sent to your email" };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { token, password } = resetPasswordDto;

        const resetToken = await this.prisma.resetPasswordToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetToken) {
            throw new NotFoundError("Reset token");
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
