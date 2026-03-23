import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { PrismaService } from "../../prisma.service";
import { ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { EmailService } from "../../email/email.service";

jest.mock("bcrypt");
jest.mock("crypto");

describe("AuthService", () => {
    let service: AuthService;
    let emailService: jest.Mocked<EmailService>;

    const mockPrismaService = {
        user: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        activateToken: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        resetPasswordToken: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        $transaction: jest.fn((callback) => callback(mockPrismaService)),
    };

    const mockEmailService = {
        sendActivationEmail: jest.fn(),
        sendPasswordResetEmail: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: EmailService,
                    useValue: mockEmailService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        emailService = module.get(EmailService);

        (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (randomBytes as jest.Mock).mockReturnValue({
            toString: () => "random-token",
        });
    });

    describe("signUp", () => {
        const signUpDto = {
            email: "test@example.com",
            userName: "testuser",
            password: "Test123!@#",
        };

        it("should create a new user successfully", async () => {
            mockPrismaService.user.findFirst.mockResolvedValue(null);
            mockPrismaService.user.create.mockResolvedValue({
                id: 1,
                ...signUpDto,
                password: "hashed-password",
                active: false,
            });

            await service.signUp(signUpDto);

            expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
            expect(emailService.sendActivationEmail).toHaveBeenCalledWith(
                signUpDto.email,
                signUpDto.userName,
                "random-token",
            );
        });

        it("should throw ConflictException if user already exists", async () => {
            mockPrismaService.user.findFirst.mockResolvedValue({ id: 1 });

            await expect(service.signUp(signUpDto)).rejects.toThrow(ConflictException);
        });
    });

    describe("validateCredentials", () => {
        const emailOrUsername = "test@example.com";
        const password = "Test123!@#";

        const mockUser = {
            id: 1,
            email: emailOrUsername,
            userName: "testuser",
            password: "hashed-password",
            active: true,
        };

        it("should return user id for valid credentials", async () => {
            mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

            const result = await service.validateCredentials(emailOrUsername, password);

            expect(result).toBe(mockUser.id);
            expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
        });

        it("should throw UnauthorizedException if user not found", async () => {
            mockPrismaService.user.findFirst.mockResolvedValue(null);

            await expect(service.validateCredentials(emailOrUsername, password)).rejects.toThrow(UnauthorizedException);
        });

        it("should throw UnauthorizedException if account is not active", async () => {
            mockPrismaService.user.findFirst.mockResolvedValue({ ...mockUser, active: false });

            await expect(service.validateCredentials(emailOrUsername, password)).rejects.toThrow(UnauthorizedException);
        });

        it("should throw UnauthorizedException if password is invalid", async () => {
            mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.validateCredentials(emailOrUsername, password)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe("activateAccount", () => {
        const activateAccountDto = { token: "valid-token" };

        it("should activate account successfully", async () => {
            mockPrismaService.activateToken.findUnique.mockResolvedValue({
                id: 1,
                userId: 1,
                token: activateAccountDto.token,
                user: { id: 1 },
            });

            await service.activateAccount(activateAccountDto);

            expect(mockPrismaService.user.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 1 }, data: { active: true } }),
            );
        });

        it("should throw NotFoundException if token is invalid", async () => {
            mockPrismaService.activateToken.findUnique.mockResolvedValue(null);

            await expect(service.activateAccount(activateAccountDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe("forgotPassword", () => {
        const forgotPasswordDto = { email: "test@example.com" };
        const mockUser = { id: 1, email: forgotPasswordDto.email, userName: "testuser" };

        it("should create reset token and send email", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            await service.forgotPassword(forgotPasswordDto);

            expect(mockPrismaService.resetPasswordToken.create).toHaveBeenCalledWith({
                data: { token: "random-token", userId: mockUser.id },
            });
            expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
                mockUser.email,
                mockUser.userName,
                "random-token",
            );
        });

        it("should throw NotFoundException if user not found", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.forgotPassword(forgotPasswordDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe("resetPassword", () => {
        const resetPasswordDto = { token: "valid-token", password: "NewTest123!@#" };
        const mockResetToken = { id: 1, userId: 1, token: resetPasswordDto.token, user: { id: 1 } };

        it("should reset password successfully", async () => {
            mockPrismaService.resetPasswordToken.findUnique.mockResolvedValue(mockResetToken);

            await service.resetPassword(resetPasswordDto);

            expect(bcrypt.hash).toHaveBeenCalledWith(resetPasswordDto.password, 10);
            expect(mockPrismaService.user.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: mockResetToken.userId }, data: { password: "hashed-password" } }),
            );
        });

        it("should throw NotFoundException if token is invalid", async () => {
            mockPrismaService.resetPasswordToken.findUnique.mockResolvedValue(null);

            await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(NotFoundException);
        });
    });
});
