import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe, Logger } from "@nestjs/common";
import { join } from "path";
import * as session from "express-session";
import * as hbs from "hbs";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

const logger = new Logger("Bootstrap");

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ["error", "warn", "log", "debug", "verbose"],
    });

    // ─── Static assets ────────────────────────────────────────────────────────
    app.useStaticAssets(join(process.cwd(), "public"));

    // ─── Handlebars view engine (root shell only) ─────────────────────────────
    app.setBaseViewsDir(join(process.cwd(), "views"));
    app.setViewEngine("hbs");
    hbs.registerHelper("json", (value: unknown) => JSON.stringify(value));

    // ─── Session (cookie-based, like Laravel) ─────────────────────────────────
    app.use(
        session({
            secret: process.env.SESSION_SECRET ?? "movielandia-secret-change-in-prod",
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                sameSite: "lax",
            },
        }),
    );

    // ─── Global validation pipe ───────────────────────────────────────────────
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    // ─── Global filters & interceptors ────────────────────────────────────────
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    // ─── Graceful shutdown ────────────────────────────────────────────────────
    app.enableShutdownHooks();

    const port = parseInt(process.env.PORT ?? "3000", 10);
    await app.listen(port);
    logger.log(`Movielandia running on: http://localhost:${port}`);
}

bootstrap();
