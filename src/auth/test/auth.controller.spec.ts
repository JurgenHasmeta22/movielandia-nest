import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { SignUpDto, SignInDto, ActivateAccountDto, ForgotPasswordDto, ResetPasswordDto } from "../dtos/auth.dto";

describe("AuthController", () => {
    let controller: AuthController;

    const mockAuthService = {
        signUp: jest.fn(),
        validateCredentials: jest.fn(),
        activateAccount: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn(),
    };

    const mockRes = () => {
        const res: any = {};
        res.redirect = jest.fn().mockReturnValue(res);
        return res;
    };

    const mockReq = (sessionData: Record<string, any> = {}) => ({
        session: { ...sessionData, destroy: jest.fn((cb: () => void) => cb()) },
        query: {},
    } as any);

    beforeEach(async () => {
        jest.clearAllMocks();

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
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("login (POST)", () => {
        it("should set session userId and redirect to / on valid credentials", async () => {
            const signInDto: SignInDto = { emailOrUsername: "test@example.com", password: "Test123!@#" };
            mockAuthService.validateCredentials.mockResolvedValue(42);
            const req = mockReq();
            const res = mockRes();

            await controller.login(signInDto, req, res);

            expect(mockAuthService.validateCredentials).toHaveBeenCalledWith(signInDto.emailOrUsername, signInDto.password);
            expect(req.session.userId).toBe(42);
            expect(res.redirect).toHaveBeenCalledWith(303, "/");
        });

        it("should set flash error and redirect to /login on invalid credentials", async () => {
            const signInDto: SignInDto = { emailOrUsername: "bad@example.com", password: "wrong" };
            mockAuthService.validateCredentials.mockRejectedValue(new Error("Invalid credentials"));
            const req = mockReq();
            const res = mockRes();

            await controller.login(signInDto, req, res);

            expect((req.session as any).flash).toEqual({ type: "error", message: "Invalid credentials" });
            expect(res.redirect).toHaveBeenCalledWith(303, "/login");
        });
    });

    describe("register (POST)", () => {
        it("should call signUp and redirect to /login on success", async () => {
            const signUpDto: SignUpDto = { email: "test@example.com", userName: "testuser", password: "Test123!@#" };
            mockAuthService.signUp.mockResolvedValue(undefined);
            const req = mockReq();
            const res = mockRes();

            await controller.register(signUpDto, req, res);

            expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto);
            expect((req.session as any).flash).toEqual({ type: "success", message: "Account created! Check your email to activate it." });
            expect(res.redirect).toHaveBeenCalledWith(303, "/login");
        });

        it("should set flash error and redirect to /register on failure", async () => {
            const signUpDto: SignUpDto = { email: "test@example.com", userName: "testuser", password: "Test123!@#" };
            mockAuthService.signUp.mockRejectedValue(new Error("User already exists"));
            const req = mockReq();
            const res = mockRes();

            await controller.register(signUpDto, req, res);

            expect((req.session as any).flash).toEqual({ type: "error", message: "User already exists" });
            expect(res.redirect).toHaveBeenCalledWith(303, "/register");
        });
    });

    describe("activateAccount (POST)", () => {
        it("should activate account and redirect to /login on success", async () => {
            const dto: ActivateAccountDto = { token: "valid-token" };
            mockAuthService.activateAccount.mockResolvedValue(undefined);
            const req = mockReq();
            const res = mockRes();

            await controller.activateAccount(dto, req, res);

            expect(mockAuthService.activateAccount).toHaveBeenCalledWith(dto);
            expect((req.session as any).flash).toEqual({ type: "success", message: "Account activated! You can now log in." });
            expect(res.redirect).toHaveBeenCalledWith(303, "/login");
        });

        it("should set flash error and redirect to /login on invalid token", async () => {
            const dto: ActivateAccountDto = { token: "bad-token" };
            mockAuthService.activateAccount.mockRejectedValue(new Error("Invalid token"));
            const req = mockReq();
            const res = mockRes();

            await controller.activateAccount(dto, req, res);

            expect((req.session as any).flash).toEqual({ type: "error", message: "Invalid or expired activation token." });
            expect(res.redirect).toHaveBeenCalledWith(303, "/login");
        });
    });

    describe("forgotPassword (POST)", () => {
        it("should send reset email and redirect on success", async () => {
            const dto: ForgotPasswordDto = { email: "test@example.com" };
            mockAuthService.forgotPassword.mockResolvedValue(undefined);
            const req = mockReq();
            const res = mockRes();

            await controller.forgotPassword(dto, req, res);

            expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(dto);
            expect((req.session as any).flash).toEqual({ type: "success", message: "Password reset link sent to your email." });
            expect(res.redirect).toHaveBeenCalledWith(303, "/forgot-password");
        });

        it("should set flash error on failure", async () => {
            const dto: ForgotPasswordDto = { email: "unknown@example.com" };
            mockAuthService.forgotPassword.mockRejectedValue(new Error("Not found"));
            const req = mockReq();
            const res = mockRes();

            await controller.forgotPassword(dto, req, res);

            expect((req.session as any).flash).toEqual({ type: "error", message: "Could not send reset email." });
        });
    });

    describe("resetPassword (POST)", () => {
        it("should reset password and redirect to /login on success", async () => {
            const dto: ResetPasswordDto = { token: "valid-token", password: "NewTest123!@#" };
            mockAuthService.resetPassword.mockResolvedValue(undefined);
            const req = mockReq();
            const res = mockRes();

            await controller.resetPassword(dto, req, res);

            expect(mockAuthService.resetPassword).toHaveBeenCalledWith(dto);
            expect((req.session as any).flash).toEqual({ type: "success", message: "Password reset successfully!" });
            expect(res.redirect).toHaveBeenCalledWith(303, "/login");
        });

        it("should set flash error and redirect back on invalid token", async () => {
            const dto: ResetPasswordDto = { token: "bad-token", password: "NewTest123!@#" };
            mockAuthService.resetPassword.mockRejectedValue(new Error("Invalid token"));
            const req = mockReq();
            const res = mockRes();

            await controller.resetPassword(dto, req, res);

            expect((req.session as any).flash).toEqual({ type: "error", message: "Invalid or expired reset token." });
            expect(res.redirect).toHaveBeenCalledWith(303, `/reset-password?token=${dto.token}`);
        });
    });
});
