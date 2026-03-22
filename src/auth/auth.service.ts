import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";
import { SignUpDto, SignInDto, ForgotPasswordDto, ResetPasswordDto, ActivateAccountDto } from "./dtos/auth.dto";
import { randomBytes } from "crypto";
import { EmailService } from "../email/email.service";
import { isValidEmail } from "../utils/validation.util";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ) {}

    async signUp(signUpDto: SignUpDto) {
        const { email, password, userName, birthday, gender, phone, countryFrom } = signUpDto;

        if (!isValidEmail(email)) {
            throw new UnauthorizedException("Invalid email format");
        }

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
                    ...(birthday ? { birthday: new Date(birthday) } : {}),
                    ...(gender ? { gender: gender as any } : {}),
                    ...(phone ? { phone } : {}),
                    ...(countryFrom ? { countryFrom } : {}),
                },
            });

            await prisma.activateToken.create({
                data: { token: activationToken, userId: newUser.id },
            });

            return newUser;
        });

        await this.emailService.sendActivationEmail(email, userName, activationToken);
    }

    /** Validate credentials, return the user id on success. */
    async validateCredentials(emailOrUsername: string, password: string): Promise<number> {
        const isEmail = isValidEmail(emailOrUsername);
        const user = await this.prisma.user.findFirst({
            where: isEmail ? { email: emailOrUsername } : { userName: emailOrUsername },
        });

        if (!user) throw new UnauthorizedException("Invalid credentials");
        if (!user.active) throw new UnauthorizedException("Please activate your account first");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException("Invalid credentials");

        return user.id;
    }

    async activateAccount(activateAccountDto: ActivateAccountDto) {
        const { token } = activateAccountDto;

        const activateToken = await this.prisma.activateToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!activateToken) throw new NotFoundException("Invalid or expired activation token");

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
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const { email } = forgotPasswordDto;

        if (!isValidEmail(email)) throw new UnauthorizedException("Invalid email format");

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundException("User not found");

        const resetToken = randomBytes(32).toString("hex");

        await this.prisma.resetPasswordToken.create({
            data: { token: resetToken, userId: user.id },
        });

        await this.emailService.sendPasswordResetEmail(email, user.userName, resetToken);
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { token, password } = resetPasswordDto;

        const resetTokenRecord = await this.prisma.resetPasswordToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetTokenRecord) throw new NotFoundException("Invalid or expired reset token");

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.prisma.$transaction(async (prisma) => {
            await prisma.user.update({
                where: { id: resetTokenRecord.userId },
                data: { password: hashedPassword },
            });

            await prisma.resetPasswordToken.delete({ where: { id: resetTokenRecord.id } });
        });
    }
}
