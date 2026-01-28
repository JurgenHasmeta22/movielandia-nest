import { Test, TestingModule } from "@nestjs/testing";
import { EpisodeController } from "./episode.controller";
import { EpisodeService } from "./episode.service";
import { mockEpisodes } from "./episode.mock-data";

describe("EpisodeController", () => {
    let controller: EpisodeController;
    let service: EpisodeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EpisodeController],
            providers: [
                {
                    provide: EpisodeService,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        findBySeasonId: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<EpisodeController>(EpisodeController);
        service = module.get<EpisodeService>(EpisodeService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("findAll", () => {
        it("should return an array of episodes", async () => {
            const query = { page: 1, pageSize: 10 };
            const result = { episodes: mockEpisodes, count: 1 };

            jest.spyOn(service, "findAll").mockResolvedValue(result);

            const response = await controller.findAll(query);

            expect(response).toBeDefined();
            expect(service.findAll).toHaveBeenCalledWith(query, undefined);
        });
    });

    describe("findOne", () => {
        it("should return a single episode", async () => {
            const episodeId = 1;
            const result = mockEpisodes[0];

            jest.spyOn(service, "findOne").mockResolvedValue(result);

            const response = await controller.findOne(episodeId);

            expect(response).toBeDefined();
            expect(service.findOne).toHaveBeenCalledWith(episodeId, undefined);
        });
    });

    describe("create", () => {
        it("should create a new episode", async () => {
            const createEpisodeDto = {
                title: "Pilot",
                description: "First episode",
                photoSrc: "https://example.com/photo.jpg",
                photoSrcProd: "https://example.com/photo-prod.jpg",
                trailerSrc: "https://example.com/trailer.mp4",
                duration: 45,
                ratingImdb: 8.5,
                seasonId: 1,
            };

            const result = { id: 1, ...createEpisodeDto, dateAired: null };

            jest.spyOn(service, "create").mockResolvedValue(result);

            const response = await controller.create(createEpisodeDto);

            expect(response).toBeDefined();
            expect(service.create).toHaveBeenCalledWith(createEpisodeDto);
        });
    });

    describe("delete", () => {
        it("should delete an episode", async () => {
            const episodeId = 1;

            jest.spyOn(service, "delete").mockResolvedValue(undefined);

            await controller.delete(episodeId);

            expect(service.delete).toHaveBeenCalledWith(episodeId);
        });
    });
});
