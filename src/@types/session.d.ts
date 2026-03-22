import "express-session";

declare module "express-session" {
    interface SessionData {
        userId?: number;
        flash?: { type: "success" | "error" | "info"; message: string };
    }
}
