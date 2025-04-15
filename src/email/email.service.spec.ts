import { Test, TestingModule } from "@nestjs/testing";
import { EmailService } from "./email.service";
import { Resend } from "resend";
import { join } from "path";
import * as ejs from "ejs";

jest.mock("resend");
jest.mock("ejs");

describe("EmailService", () => {
    let service: EmailService;
    let mockResend: jest.Mocked<Resend>;
    let mockSend: jest.Mock;

    beforeEach(async () => {
        process.env.RESEND_API_KEY = "test-api-key";
        process.env.FRONTEND_URL = "http://localhost:3000";

        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailService],
        }).compile();

        service = module.get<EmailService>(EmailService);

        // Create mock with proper typing
        mockSend = jest.fn().mockResolvedValue({ id: "mock-id" });
        mockResend = {
            emails: {
                send: mockSend,
            },
        } as unknown as jest.Mocked<Resend>;

        (Resend as jest.MockedClass<typeof Resend>).mockImplementation(() => mockResend);
        (ejs.renderFile as jest.Mock).mockResolvedValue("<html>Test template</html>");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("sendActivationEmail", () => {
        it("should send activation email with correct parameters", async () => {
            const email = "test@example.com";
            const userName = "testuser";
            const token = "test-token";

            await service.sendActivationEmail(email, userName, token);

            expect(ejs.renderFile).toHaveBeenCalledWith(
                expect.stringContaining("registration.ejs"),
                expect.objectContaining({
                    userName,
                    verificationLink: `http://localhost:3000/auth/activate?token=${token}`,
                }),
            );

            expect(mockResend.emails.send).toHaveBeenCalledWith({
                from: "Movielandia <noreply@movielandia.com>",
                to: email,
                subject: "Welcome to MovieLandia24! Verify your email",
                html: expect.any(String),
            });
        });

        it("should throw error when email sending fails", async () => {
            const error = new Error("Email sending failed");
            mockSend.mockRejectedValueOnce(error);

            await expect(service.sendActivationEmail("test@example.com", "testuser", "token")).rejects.toThrow(
                "Email sending failed",
            );
        });
    });

    describe("sendPasswordResetEmail", () => {
        it("should send password reset email with correct parameters", async () => {
            const email = "test@example.com";
            const userName = "testuser";
            const token = "reset-token";

            await service.sendPasswordResetEmail(email, userName, token);

            expect(ejs.renderFile).toHaveBeenCalledWith(
                expect.stringContaining("reset-password.ejs"),
                expect.objectContaining({
                    userName,
                    resetLink: `http://localhost:3000/auth/reset-password?token=${token}`,
                }),
            );

            expect(mockResend.emails.send).toHaveBeenCalledWith({
                from: "Movielandia <noreply@movielandia.com>",
                to: email,
                subject: "Reset Your MovieLandia24 Password",
                html: expect.any(String),
            });
        });

        it("should throw error when template rendering fails", async () => {
            const error = new Error("Template rendering failed");
            (ejs.renderFile as jest.Mock).mockRejectedValueOnce(error);

            await expect(service.sendPasswordResetEmail("test@example.com", "testuser", "token")).rejects.toThrow(
                "Template rendering failed",
            );
        });
    });

    describe("sendNewsletterWelcomeEmail", () => {
        it("should send newsletter welcome email with correct parameters and default frequency", async () => {
            const email = "test@example.com";
            const userName = "testuser";

            await service.sendNewsletterWelcomeEmail(email, userName);

            expect(ejs.renderFile).toHaveBeenCalledWith(
                expect.stringContaining("newsletter-welcome.ejs"),
                expect.objectContaining({
                    userName,
                    frequency: "weekly",
                    profileSettingsUrl: "http://localhost:3000/settings/notifications",
                    recommendationsUrl: "http://localhost:3000/movies/recommended",
                }),
            );

            expect(mockResend.emails.send).toHaveBeenCalledWith({
                from: "Movielandia <noreply@movielandia.com>",
                to: email,
                subject: "Welcome to MovieLandia24 Newsletter! 🎬",
                html: expect.any(String),
            });
        });

        it("should use custom frequency when provided", async () => {
            await service.sendNewsletterWelcomeEmail("test@example.com", "testuser", "daily");

            expect(ejs.renderFile).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    frequency: "daily",
                }),
            );
        });
    });

    describe("sendNotificationEmail", () => {
        it("should send follow notification with correct parameters", async () => {
            const email = "test@example.com";
            const type = "follow";
            const data = {
                userName: "recipient",
                senderName: "follower",
                profileUrl: "http://example.com/profile",
            };

            await service.sendNotificationEmail(email, type, data);

            expect(ejs.renderFile).toHaveBeenCalledWith(
                expect.stringContaining("notification.ejs"),
                expect.objectContaining({
                    notificationType: type,
                    ...data,
                }),
            );

            expect(mockResend.emails.send).toHaveBeenCalledWith({
                from: "Movielandia <noreply@movielandia.com>",
                to: email,
                subject: `${data.senderName} started following you on MovieLandia24`,
                html: expect.any(String),
            });
        });

        it("should send review notification with correct parameters", async () => {
            const email = "test@example.com";
            const type = "review";
            const data = {
                userName: "recipient",
                senderName: "reviewer",
                contentType: "movie",
                preview: "Great movie!",
                contentUrl: "http://example.com/movie/1",
            };

            await service.sendNotificationEmail(email, type, data);

            expect(mockResend.emails.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    subject: `New Review on your ${data.contentType}`,
                }),
            );
        });

        it("should handle missing optional data fields", async () => {
            const email = "test@example.com";
            const type = "forum_reply";
            const data = {
                userName: "recipient",
                senderName: "replier",
                topicTitle: "Discussion topic",
            };

            await service.sendNotificationEmail(email, type, data);

            expect(ejs.renderFile).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    notificationType: type,
                    ...data,
                }),
            );
        });
    });
});
