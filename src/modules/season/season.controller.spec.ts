import { Test, TestingModule } from "@nestjs/testing";
import { SeasonController } from "./season.controller";
import { SeasonService } from "./season.service";
import { mockSeasons } from "./season.mock-data";

describe("SeasonController", () => {
    let controller: SeasonController;
    let service: SeasonService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SeasonController],
            providers: [
                {
                    provide: SeasonService,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        findBySerieId: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<SeasonController>(SeasonController);
        service = module.get<SeasonService>(SeasonService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("findAll", () => {
        it("should return an array of seasons", async () => {
            const query = { page: 1, pageSize: 10 };
            const result = { seasons: mockSeasons, count: 1 };

            jest.spyOn(service, "findAll").mockResolvedValue(result);

            const response = await controller.findAll(query);

            expect(response).toBeDefined();
            expect(service.findAll).toHaveBeenCalledWith(query, undefined);
        });
    });

    describe("findOne", () => {
        it("should return a single season", async () => {
            const seasonId = 1;
            const result = mockSeasons[0];

            jest.spyOn(service, "findOne").mockResolvedValue(result);

            const response = await controller.findOne(seasonId);

            expect(response).toBeDefined();
            expect(service.findOne).toHaveBeenCalledWith(seasonId, undefined);
        });
    });

    describe("create", () => {
        it("should create a new season", async () => {
            const createSeasonDto = {
                title: "Season 1",
                description: "First season",
                photoSrc: "https://example.com/photo.jpg",
                photoSrcProd: "https://example.com/photo-prod.jpg",
                trailerSrc: "https://example.com/trailer.mp4",
                ratingImdb: 8.5,
                serieId: 1,
            };

            const result = { id: 1, ...createSeasonDto, dateAired: null };

            jest.spyOn(service, "create").mockResolvedValue(result);

            const response = await controller.create(createSeasonDto);

            expect(response).toBeDefined();
            expect(service.create).toHaveBeenCalledWith(createSeasonDto);
        });
    });

    describe("delete", () => {
        it("should delete a season", async () => {
            const seasonId = 1;

            jest.spyOn(service, "delete").mockResolvedValue(undefined);

            await controller.delete(seasonId);

            expect(service.delete).toHaveBeenCalledWith(seasonId);
        });
    });
});
