import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: true,
        credentials: true,
    });

    app.useStaticAssets(join(__dirname, "..", "public"));

    const config = new DocumentBuilder()
        .setTitle("Movielandia API")
        .setDescription("The Movielandia API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    await app.listen(3000);
    console.log(`Application is running on: http://localhost:3000`);
}

bootstrap();
