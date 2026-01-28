import { Test, TestingModule } from "@nestjs/testing";
import { SeasonService } from "./season.service";
import { PrismaService } from "../../prisma.service";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockSeasons } from "./season.mock-data";

describe("SeasonService", () => {
    let service: SeasonService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SeasonService,
                {
                    provide: PrismaService,
                    useValue: {
                        season: {
                            findMany: jest.fn(),
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                            count: jest.fn(),
                        },
                        seasonReview: {
                            findMany: jest.fn(),
                            findFirst: jest.fn(),
                        },
                        userSeasonFavorite: {
                            findFirst: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<SeasonService>(SeasonService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findOne", () => {
        it("should return a season by id", async () => {
            const seasonId = 1;
            const mockSeason = mockSeasons[0];

            jest.spyOn(prismaService.season, "findFirst").mockResolvedValue(mockSeason);

            const result = await service.findOne(seasonId);

            expect(result).toBeDefined();
            expect(prismaService.season.findFirst).toHaveBeenCalledWith({
                where: { id: seasonId },
                include: expect.any(Object),
            });
        });

        it("should throw NotFoundException if season does not exist", async () => {
            const seasonId = 999;

            jest.spyOn(prismaService.season, "findFirst").mockResolvedValue(null);

            await expect(service.findOne(seasonId)).rejects.toThrow(NotFoundException);
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

            const mockSeason = { id: 1, ...createSeasonDto, dateAired: null };

            jest.spyOn(prismaService.season, "create").mockResolvedValue(mockSeason);

            const result = await service.create(createSeasonDto);

            expect(result).toBeDefined();
            expect(prismaService.season.create).toHaveBeenCalled();
        });
    });

    describe("delete", () => {
        it("should delete a season by id", async () => {
            const seasonId = 1;
            const mockSeason = mockSeasons[0];

            jest.spyOn(prismaService.season, "findFirst").mockResolvedValue(mockSeason);
            jest.spyOn(prismaService.season, "delete").mockResolvedValue(mockSeason);

            await service.delete(seasonId);

            expect(prismaService.season.delete).toHaveBeenCalledWith({
                where: { id: seasonId },
            });
        });

        it("should throw NotFoundException if season does not exist", async () => {
            const seasonId = 999;

            jest.spyOn(prismaService.season, "findFirst").mockResolvedValue(null);

            await expect(service.delete(seasonId)).rejects.toThrow(NotFoundException);
        });
    });
});
