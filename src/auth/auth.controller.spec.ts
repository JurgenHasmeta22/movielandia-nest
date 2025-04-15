import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SignUpDto, SignInDto, ActivateAccountDto, ForgotPasswordDto, ResetPasswordDto } from "./dtos/auth.dto";

describe("AuthController", () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        signUp: jest.fn(),
        signIn: jest.fn(),
        activateAccount: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("signup", () => {
        it("should create a new user", async () => {
            const signUpDto: SignUpDto = {
                email: "test@example.com",
                userName: "testuser",
                password: "Test123!@#",
            };
            const expectedResult = {
                message: "User created successfully. Please check your email to activate your account.",
            };

            mockAuthService.signUp.mockResolvedValue(expectedResult);

            const result = await controller.signup(signUpDto);

            expect(result).toEqual(expectedResult);
            expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto);
        });
    });

    describe("signin", () => {
        it("should return access token when credentials are valid", async () => {
            const signInDto: SignInDto = {
                email: "test@example.com",
                password: "Test123!@#",
            };
            const expectedResult = {
                accessToken: "jwt-token",
            };

            mockAuthService.signIn.mockResolvedValue(expectedResult);

            const result = await controller.signin(signInDto);

            expect(result).toEqual(expectedResult);
            expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto);
        });
    });

    describe("activateAccount", () => {
        it("should activate user account with valid token", async () => {
            const activateAccountDto: ActivateAccountDto = {
                token: "valid-token",
            };
            const expectedResult = {
                message: "Account activated successfully",
            };

            mockAuthService.activateAccount.mockResolvedValue(expectedResult);

            const result = await controller.activateAccount(activateAccountDto);

            expect(result).toEqual(expectedResult);
            expect(mockAuthService.activateAccount).toHaveBeenCalledWith(activateAccountDto);
        });
    });

    describe("forgotPassword", () => {
        it("should send reset password email", async () => {
            const forgotPasswordDto: ForgotPasswordDto = {
                email: "test@example.com",
            };
            const expectedResult = {
                message: "Password reset instructions have been sent to your email",
            };

            mockAuthService.forgotPassword.mockResolvedValue(expectedResult);

            const result = await controller.forgotPassword(forgotPasswordDto);

            expect(result).toEqual(expectedResult);
            expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto);
        });
    });

    describe("resetPassword", () => {
        it("should reset user password with valid token", async () => {
            const resetPasswordDto: ResetPasswordDto = {
                token: "valid-token",
                password: "NewTest123!@#",
            };
            const expectedResult = {
                message: "Password reset successfully",
            };

            mockAuthService.resetPassword.mockResolvedValue(expectedResult);

            const result = await controller.resetPassword(resetPasswordDto);

            expect(result).toEqual(expectedResult);
            expect(mockAuthService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
        });
    });
});
