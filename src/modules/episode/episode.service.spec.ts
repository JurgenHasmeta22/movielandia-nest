import { Test, TestingModule } from "@nestjs/testing";
import { EpisodeService } from "./episode.service";
import { PrismaService } from "../../prisma.service";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockEpisodes } from "./episode.mock-data";

describe("EpisodeService", () => {
    let service: EpisodeService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EpisodeService,
                {
                    provide: PrismaService,
                    useValue: {
                        episode: {
                            findMany: jest.fn(),
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                            count: jest.fn(),
                        },
                        episodeReview: {
                            findMany: jest.fn(),
                            findFirst: jest.fn(),
                        },
                        userEpisodeFavorite: {
                            findFirst: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<EpisodeService>(EpisodeService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findOne", () => {
        it("should return an episode by id", async () => {
            const episodeId = 1;
            const mockEpisode = mockEpisodes[0];

            jest.spyOn(prismaService.episode, "findFirst").mockResolvedValue(mockEpisode);

            const result = await service.findOne(episodeId);

            expect(result).toBeDefined();
            expect(prismaService.episode.findFirst).toHaveBeenCalledWith({
                where: { id: episodeId },
                include: expect.any(Object),
            });
        });

        it("should throw NotFoundException if episode does not exist", async () => {
            const episodeId = 999;

            jest.spyOn(prismaService.episode, "findFirst").mockResolvedValue(null);

            await expect(service.findOne(episodeId)).rejects.toThrow(NotFoundException);
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

            const mockEpisode = { id: 1, ...createEpisodeDto, dateAired: null };

            jest.spyOn(prismaService.episode, "create").mockResolvedValue(mockEpisode);

            const result = await service.create(createEpisodeDto);

            expect(result).toBeDefined();
            expect(prismaService.episode.create).toHaveBeenCalled();
        });
    });

    describe("delete", () => {
        it("should delete an episode by id", async () => {
            const episodeId = 1;
            const mockEpisode = mockEpisodes[0];

            jest.spyOn(prismaService.episode, "findFirst").mockResolvedValue(mockEpisode);
            jest.spyOn(prismaService.episode, "delete").mockResolvedValue(mockEpisode);

            await service.delete(episodeId);

            expect(prismaService.episode.delete).toHaveBeenCalledWith({
                where: { id: episodeId },
            });
        });

        it("should throw NotFoundException if episode does not exist", async () => {
            const episodeId = 999;

            jest.spyOn(prismaService.episode, "findFirst").mockResolvedValue(null);

            await expect(service.delete(episodeId)).rejects.toThrow(NotFoundException);
        });
    });
});
