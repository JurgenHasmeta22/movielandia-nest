import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { EmailService } from '../src/email/email.service';
import { JwtStrategy } from '../src/auth/guards/jwt.strategy';
import { MockJwtStrategy } from './mocks/jwt-strategy.mock';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let emailService: jest.Mocked<EmailService>;
  let activationToken: string;
  let resetToken: string;

  const testUser = {
    email: 'test@example.com',
    userName: 'testuser',
    password: 'Test123!@#',
  };

  beforeAll(async () => {
    const mockEmailService = {
      sendActivationEmail: jest.fn((email, userName, token) => {
        activationToken = token;
        return Promise.resolve();
      }),
      sendPasswordResetEmail: jest.fn((email, userName, token) => {
        resetToken = token;
        return Promise.resolve();
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtStrategy)
      .useClass(MockJwtStrategy)
      .overrideProvider(EmailService)
      .useValue(mockEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    
    prisma = app.get<PrismaService>(PrismaService);
    emailService = moduleFixture.get(EmailService);
    
    // Ensure database is connected
    await prisma.$connect();
    
    await app.init();
  });

  beforeEach(async () => {
    // Clean up the database before each test
    if (prisma.resetPasswordToken) {
      await prisma.resetPasswordToken.deleteMany();
    }
    if (prisma.activateToken) {
      await prisma.activateToken.deleteMany();
    }
    if (prisma.user) {
      await prisma.user.deleteMany();
    }
  });

  afterAll(async () => {
    if (prisma.resetPasswordToken) {
      await prisma.resetPasswordToken.deleteMany();
    }
    if (prisma.activateToken) {
      await prisma.activateToken.deleteMany();
    }
    if (prisma.user) {
      await prisma.user.deleteMany();
    }
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /auth/signup', () => {
    it('should create a new user and send activation email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser)
        .expect(201);

      expect(response.body).toEqual({
        message: 'User created successfully. Please check your email to activate your account.',
      });

      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(user).toBeDefined();
      expect(user.active).toBe(false);
      expect(emailService.sendActivationEmail).toHaveBeenCalled();
    });

    it('should fail if user already exists', async () => {
      // First create a user
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser);

      // Try to create the same user again
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser)
        .expect(409);

      expect(response.body.message).toBe('User with this email or username already exists');
    });

    it('should validate user input', async () => {
      const invalidUser = {
        email: 'invalid-email',
        userName: 'a', // too short
        password: '123', // doesn't meet password requirements
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(invalidUser)
        .expect(400);

      expect(response.body.message).toBeInstanceOf(Array);
    });
  });

  describe('POST /auth/activate', () => {
    beforeEach(async () => {
      // Create a user first
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser);
    });

    it('should activate user account with valid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/activate')
        .send({ token: activationToken })
        .expect(200);

      expect(response.body).toEqual({
        message: 'Account activated successfully',
      });

      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(user.active).toBe(true);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/activate')
        .send({ token: 'invalid-token' })
        .expect(404);

      expect(response.body.message).toBe('Invalid or expired activation token');
    });
  });

  describe('POST /auth/signin', () => {
    beforeEach(async () => {
      // Create and activate a user
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser);

      await request(app.getHttpServer())
        .post('/auth/activate')
        .send({ token: activationToken });
    });

    it('should sign in user with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.accessToken).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: testUser.email,
          password: 'wrong-password',
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should fail if account is not activated', async () => {
      // Create a new unactivated user
      const unactivatedUser = {
        email: 'unactivated@example.com',
        userName: 'unactivated',
        password: 'Test123!@#',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(unactivatedUser);

      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: unactivatedUser.email,
          password: unactivatedUser.password,
        })
        .expect(401);

      expect(response.body.message).toBe('Please activate your account first');
    });
  });

  describe('POST /auth/forgot-password', () => {
    beforeEach(async () => {
      // Create and activate a user
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser);

      await request(app.getHttpServer())
        .post('/auth/activate')
        .send({ token: activationToken });
    });

    it('should send reset password email for existing user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: testUser.email })
        .expect(200);

      expect(response.body).toEqual({
        message: 'Password reset instructions have been sent to your email',
      });
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });

  describe('POST /auth/reset-password', () => {
    beforeEach(async () => {
      // Create and activate a user
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser);

      await request(app.getHttpServer())
        .post('/auth/activate')
        .send({ token: activationToken });

      // Request password reset
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: testUser.email });
    });

    it('should reset password with valid token', async () => {
      const newPassword = 'NewTest123!@#';
      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: resetToken,
          password: newPassword,
        })
        .expect(200);

      expect(response.body).toEqual({
        message: 'Password reset successfully',
      });

      // Try signing in with new password
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: testUser.email,
          password: newPassword,
        })
        .expect(200);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: 'invalid-token',
          password: 'NewTest123!@#',
        })
        .expect(404);

      expect(response.body.message).toBe('Invalid or expired reset token');
    });

    it('should validate new password requirements', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: resetToken,
          password: 'weak',
        })
        .expect(400);

      expect(response.body.message).toBeInstanceOf(Array);
    });
  });
});