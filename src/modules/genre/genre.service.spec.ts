import { Test, TestingModule } from "@nestjs/testing";
import { GenreService } from "./genre.service";
import { PrismaService } from "../../prisma.service";
import { GenreQueryDto, SortOrder } from "./dtos/genre-query.dto";
import { CreateGenreDto } from "./dtos/create-genre.dto";
import { UpdateGenreDto } from "./dtos/update-genre.dto";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockGenre } from "./genre.mock-data";

describe("GenreService", () => {
    let service: GenreService;
    let prisma: PrismaService;

    const mockPrismaService = {
        genre: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        userGenreFavorite: {
            findFirst: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GenreService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<GenreService>(GenreService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findAll", () => {
        it("should return a list of genres", async () => {
            const mockGenres = [mockGenre];
            const query: GenreQueryDto = { page: 1, perPage: 20 };

            jest.spyOn(prisma.genre, "findMany").mockResolvedValue(mockGenres);
            jest.spyOn(prisma.genre, "count").mockResolvedValue(1);
            jest.spyOn(prisma.userGenreFavorite, "findFirst").mockResolvedValue(null);

            const result = await service.findAll(query);

            expect(result).toBeDefined();
            expect(result.genres).toHaveLength(1);
            expect(result.count).toBe(1);
        });
    });

    describe("findOne", () => {
        it("should return a genre by id", async () => {
            jest.spyOn(prisma.genre, "findFirst").mockResolvedValue(mockGenre);
            jest.spyOn(prisma.userGenreFavorite, "findFirst").mockResolvedValue(null);

            const result = await service.findOne(mockGenre.id);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockGenre.id);
        });

        it("should throw NotFoundException when genre is not found", async () => {
            jest.spyOn(prisma.genre, "findFirst").mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe("create", () => {
        it("should create a new genre", async () => {
            const createDto: CreateGenreDto = {
                name: "Comedy",
            };

            jest.spyOn(prisma.genre, "create").mockResolvedValue(mockGenre);

            const result = await service.create(createDto);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockGenre.id);
        });
    });

    describe("update", () => {
        it("should update a genre", async () => {
            const updateDto: UpdateGenreDto = { name: "Drama" };

            jest.spyOn(prisma.genre, "findFirst").mockResolvedValue(mockGenre);
            jest.spyOn(prisma.genre, "update").mockResolvedValue({
                ...mockGenre,
                name: "drama",
            });

            const result = await service.update(mockGenre.id, updateDto);

            expect(result).toBeDefined();
        });

        it("should throw NotFoundException when genre is not found", async () => {
            jest.spyOn(prisma.genre, "findFirst").mockResolvedValue(null);

            await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
        });
    });

    describe("remove", () => {
        it("should delete a genre", async () => {
            jest.spyOn(prisma.genre, "findFirst").mockResolvedValue(mockGenre);
            jest.spyOn(prisma.genre, "delete").mockResolvedValue(mockGenre);

            await service.remove(mockGenre.id);

            expect(prisma.genre.delete).toHaveBeenCalled();
        });

        it("should throw NotFoundException when genre is not found", async () => {
            jest.spyOn(prisma.genre, "findFirst").mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});
