import { Injectable } from "@nestjs/common";
import { Resend } from "resend";
import { join } from "path";
import * as ejs from "ejs";

@Injectable()
export class EmailService {
    private resend: Resend;
    private baseUrl: string;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.baseUrl = process.env.FRONTEND_URL;
    }

    private async renderTemplate(templateName: string, data: any): Promise<string> {
        const templatePath = join(__dirname, "templates", "emails", `${templateName}.ejs`);
        return ejs.renderFile(templatePath, {
            ...data,
            baseUrl: this.baseUrl,
        });
    }

    async sendActivationEmail(email: string, userName: string, token: string) {
        const verificationLink = `${this.baseUrl}/auth/activate?token=${token}`;
        const html = await this.renderTemplate("registration", {
            userName,
            verificationLink,
        });

        await this.resend.emails.send({
            from: "Movielandia <noreply@movielandia.com>",
            to: email,
            subject: "Welcome to MovieLandia24! Verify your email",
            html,
        });
    }

    async sendPasswordResetEmail(email: string, userName: string, token: string) {
        const resetLink = `${this.baseUrl}/auth/reset-password?token=${token}`;
        const html = await this.renderTemplate("reset-password", {
            userName,
            resetLink,
        });

        await this.resend.emails.send({
            from: "Movielandia <noreply@movielandia.com>",
            to: email,
            subject: "Reset Your MovieLandia24 Password",
            html,
        });
    }

    async sendNewsletterWelcomeEmail(email: string, userName: string, frequency: string = "weekly") {
        const html = await this.renderTemplate("newsletter-welcome", {
            userName,
            frequency,
            profileSettingsUrl: `${this.baseUrl}/settings/notifications`,
            recommendationsUrl: `${this.baseUrl}/movies/recommended`,
        });

        await this.resend.emails.send({
            from: "Movielandia <noreply@movielandia.com>",
            to: email,
            subject: "Welcome to MovieLandia24 Newsletter! 🎬",
            html,
        });
    }

    async sendNotificationEmail(
        email: string,
        type: "follow" | "review" | "forum_reply" | "list_mention",
        data: {
            userName: string;
            senderName: string;
            contentType?: string;
            preview?: string;
            topicTitle?: string;
            listTitle?: string;
            contentUrl?: string;
            profileUrl?: string;
            forumUrl?: string;
            listUrl?: string;
        },
    ) {
        const html = await this.renderTemplate("notification", {
            notificationType: type,
            notificationSettingsUrl: `${this.baseUrl}/settings/notifications`,
            ...data,
        });

        let subject = "New Notification from MovieLandia24";
        switch (type) {
            case "follow":
                subject = `${data.senderName} started following you on MovieLandia24`;
                break;
            case "review":
                subject = `New Review on your ${data.contentType}`;
                break;
            case "forum_reply":
                subject = `New Reply in "${data.topicTitle}"`;
                break;
            case "list_mention":
                subject = `Added to list "${data.listTitle}"`;
                break;
        }

        await this.resend.emails.send({
            from: "Movielandia <noreply@movielandia.com>",
            to: email,
            subject,
            html,
        });
    }
}
