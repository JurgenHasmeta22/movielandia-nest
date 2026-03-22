import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe, Logger, VersioningType } from "@nestjs/common";
import { join } from "path";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

const logger = new Logger("Bootstrap");

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        // Use NestJS built-in logger — no console.log in production code
        logger: ["error", "warn", "log", "debug", "verbose"],
    });

    // ─── CORS ─────────────────────────────────────────────────────────────────
    app.enableCors({
        origin: process.env.CORS_ORIGIN ?? true,
        credentials: true,
    });

    // ─── Static assets ────────────────────────────────────────────────────────
    app.useStaticAssets(join(__dirname, "..", "public"));

    // ─── API prefix ───────────────────────────────────────────────────────────
    app.setGlobalPrefix("api");

    // ─── Global validation pipe ───────────────────────────────────────────────
    // whitelist   → strips properties not declared in the DTO
    // transform   → auto-converts plain objects to DTO instances & coerces primitives
    // forbidNonWhitelisted → throws 400 for unexpected properties instead of silently stripping
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    // ─── Global exception filter ──────────────────────────────────────────────
    app.useGlobalFilters(new AllExceptionsFilter());

    // ─── Global interceptors ──────────────────────────────────────────────────

    app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new TransformInterceptor(),
    );

    // ─── Graceful shutdown ────────────────────────────────────────────────────
    app.enableShutdownHooks();

    // ─── Swagger ──────────────────────────────────────────────────────────────
    const swaggerConfig = new DocumentBuilder()
        .setTitle("Movielandia API")
        .setDescription("REST API for the Movielandia streaming platform")
        .setVersion("1.0")
        .addBearerAuth(
            { type: "http", scheme: "bearer", bearerFormat: "JWT" },
            "access-token",
        )
        .addTag("Auth", "Authentication & account management")
        .addTag("Movies", "Movie catalogue")
        .addTag("Series", "Series catalogue")
        .addTag("Seasons", "Season catalogue")
        .addTag("Episodes", "Episode catalogue")
        .addTag("Genres", "Genre catalogue")
        .addTag("Actors", "Actor catalogue")
        .addTag("Crew", "Crew catalogue")
        .addTag("Users", "User profiles & social features")
        .addTag("Reviews", "Content reviews")
        .addTag("Lists", "User lists")
        .addTag("Forum", "Community forum")
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, document, {
        swaggerOptions: { persistAuthorization: true },
    });

    const port = parseInt(process.env.PORT ?? "3000", 10);
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Swagger docs available at: http://localhost:${port}/docs`);
}

bootstrap();
