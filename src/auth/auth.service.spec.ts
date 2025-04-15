import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from '@/email/email.service';

jest.mock('bcrypt');
jest.mock('crypto');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;
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

  const mockJwtService = {
    sign: jest.fn(),
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
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
    emailService = module.get(EmailService);

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (randomBytes as jest.Mock).mockReturnValue({
      toString: () => 'random-token',
    });
  });

  describe('signUp', () => {
    const signUpDto = {
      email: 'test@example.com',
      userName: 'testuser',
      password: 'Test123!@#',
    };

    it('should create a new user successfully', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        ...signUpDto,
        password: 'hashed-password',
        active: false,
      });

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({
        message: 'User created successfully. Please check your email to activate your account.',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
      expect(emailService.sendActivationEmail).toHaveBeenCalledWith(
        signUpDto.email,
        signUpDto.userName,
        'random-token'
      );
    });

    it('should throw ConflictException if user already exists', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({ id: 1 });

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('signIn', () => {
    const signInDto = {
      email: 'test@example.com',
      password: 'Test123!@#',
    };

    const mockUser = {
      id: 1,
      email: signInDto.email,
      password: 'hashed-password',
      active: true,
    };

    it('should return access token for valid credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.signIn(signInDto);

      expect(result).toEqual({ accessToken: 'jwt-token' });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.password
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if account is not active', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        active: false,
      });

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('activateAccount', () => {
    const activateAccountDto = {
      token: 'valid-token',
    };

    it('should activate account successfully', async () => {
      mockPrismaService.activateToken.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        token: activateAccountDto.token,
        user: { id: 1 },
      });

      const result = await service.activateAccount(activateAccountDto);

      expect(result).toEqual({ message: 'Account activated successfully' });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { active: true },
      });
    });

    it('should throw NotFoundException if token is invalid', async () => {
      mockPrismaService.activateToken.findUnique.mockResolvedValue(null);

      await expect(
        service.activateAccount(activateAccountDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto = {
      email: 'test@example.com',
    };

    const mockUser = {
      id: 1,
      email: forgotPasswordDto.email,
      userName: 'testuser',
    };

    it('should create reset token and send email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(result).toEqual({
        message: 'Password reset instructions have been sent to your email',
      });
      expect(mockPrismaService.resetPasswordToken.create).toHaveBeenCalledWith({
        data: {
          token: 'random-token',
          userId: mockUser.id,
        },
      });
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.userName,
        'random-token'
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.forgotPassword(forgotPasswordDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto = {
      token: 'valid-token',
      password: 'NewTest123!@#',
    };

    const mockResetToken = {
      id: 1,
      userId: 1,
      token: resetPasswordDto.token,
      user: { id: 1 },
    };

    it('should reset password successfully', async () => {
      mockPrismaService.resetPasswordToken.findUnique.mockResolvedValue(
        mockResetToken
      );

      const result = await service.resetPassword(resetPasswordDto);

      expect(result).toEqual({ message: 'Password reset successfully' });
      expect(bcrypt.hash).toHaveBeenCalledWith(resetPasswordDto.password, 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockResetToken.userId },
        data: { password: 'hashed-password' },
      });
    });

    it('should throw NotFoundException if token is invalid', async () => {
      mockPrismaService.resetPasswordToken.findUnique.mockResolvedValue(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});