import { Test, TestingModule } from "@nestjs/testing";
import { SerieService } from "./serie.service";
import { PrismaService } from "../../prisma.service";
import { SerieQueryDto, SortOrder } from "./dtos/serie-query.dto";
import { CreateSerieDto } from "./dtos/create-serie.dto";
import { UpdateSerieDto } from "./dtos/update-serie.dto";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockSerie, mockSerieRatingInfo, mockSerieWithDetails } from "./serie.mock-data";

describe("SerieService", () => {
    let service: SerieService;
    let prisma: PrismaService;

    const mockPrismaService = {
        serie: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        serieReview: {
            groupBy: jest.fn(),
            count: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
        },
        serieGenre: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
        castSerie: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
        crewSerie: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
        userSerieFavorite: {
            findFirst: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SerieService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<SerieService>(SerieService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findAll", () => {
        it("should return a list of series", async () => {
            const mockSeries = [mockSerie];
            const query: SerieQueryDto = { page: 1, perPage: 12 };

            jest.spyOn(prisma.serie, "findMany").mockResolvedValue(mockSeries);
            (mockPrismaService.serieReview.groupBy as jest.Mock).mockResolvedValue([
                { serieId: mockSerie.id, _avg: { rating: 4.5 }, _count: { rating: 10 } },
            ]);
            jest.spyOn(prisma.serie, "count").mockResolvedValue(1);
            jest.spyOn(prisma.userSerieFavorite, "findFirst").mockResolvedValue(null);

            const result = await service.findAll(query);

            expect(result).toBeDefined();
            expect(result.series).toHaveLength(1);
            expect(result.count).toBe(1);
        });

        it("should throw BadRequestException for invalid query", async () => {
            const query: SerieQueryDto = { page: -1, perPage: 12 };
            jest.spyOn(prisma.serie, "findMany").mockRejectedValue({ code: "P2022" });

            await expect(service.findAll(query)).rejects.toThrow(BadRequestException);
        });
    });

    describe("findOne", () => {
        it("should return a serie by id", async () => {
            jest.spyOn(prisma.serie, "findFirst").mockResolvedValue(mockSerie);
            (mockPrismaService.serieReview.groupBy as jest.Mock).mockResolvedValue([
                { serieId: mockSerie.id, _avg: { rating: 4.5 }, _count: { rating: 10 } },
            ]);
            jest.spyOn(prisma.userSerieFavorite, "findFirst").mockResolvedValue(null);

            const result = await service.findOne(mockSerie.id);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockSerie.id);
        });

        it("should throw NotFoundException when serie is not found", async () => {
            jest.spyOn(prisma.serie, "findFirst").mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe("create", () => {
        it("should create a new serie", async () => {
            const createDto: CreateSerieDto = {
                title: "New Serie",
                description: "A new serie",
                photoSrc: "http://example.com/photo.jpg",
                photoSrcProd: "http://example.com/photo-prod.jpg",
                trailerSrc: "http://example.com/trailer.mp4",
                ratingImdb: 8.0,
            };

            jest.spyOn(prisma.serie, "create").mockResolvedValue(mockSerie);

            const result = await service.create(createDto);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockSerie.id);
        });
    });

    describe("update", () => {
        it("should update a serie", async () => {
            const updateDto: UpdateSerieDto = { title: "Updated Title" };

            jest.spyOn(prisma.serie, "findFirst").mockResolvedValue(mockSerie);
            jest.spyOn(prisma.serie, "update").mockResolvedValue({
                ...mockSerie,
                title: "updated title",
            });

            const result = await service.update(mockSerie.id, updateDto);

            expect(result).toBeDefined();
        });

        it("should throw NotFoundException when serie is not found", async () => {
            jest.spyOn(prisma.serie, "findFirst").mockResolvedValue(null);

            await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
        });
    });

    describe("remove", () => {
        it("should delete a serie", async () => {
            jest.spyOn(prisma.serie, "findFirst").mockResolvedValue(mockSerie);
            jest.spyOn(prisma.serie, "delete").mockResolvedValue(mockSerie);

            await service.remove(mockSerie.id);

            expect(prisma.serie.delete).toHaveBeenCalled();
        });

        it("should throw NotFoundException when serie is not found", async () => {
            jest.spyOn(prisma.serie, "findFirst").mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});
