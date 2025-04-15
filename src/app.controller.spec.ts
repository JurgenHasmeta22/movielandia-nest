import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();
    });

    describe("getIntro", () => {
        it('should return "Movielandia24 REST API"', () => {
            const appController = app.get(AppController);
            expect(appController.getIntro()).toBe("Movielandia24 REST API");
        });
    });
});
