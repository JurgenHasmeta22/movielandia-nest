import { Test, TestingModule } from "@nestjs/testing";
import { CrewService } from "./crew.service";
import { PrismaService } from "../../prisma.service";
import { CrewQueryDto, SortOrder } from "./dtos/crew-query.dto";
import { CreateCrewDto } from "./dtos/create-crew.dto";
import { UpdateCrewDto } from "./dtos/update-crew.dto";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockCrew, mockCrewRatingInfo, mockCrewWithDetails } from "./crew.mock-data";

describe("CrewService", () => {
    let service: CrewService;
    let prisma: PrismaService;

    const mockPrismaService = {
        crew: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        crewReview: {
            groupBy: jest.fn(),
            findFirst: jest.fn(),
        },
        userCrewFavorite: {
            findFirst: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CrewService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<CrewService>(CrewService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findAll", () => {
        it("should return a list of crew members", async () => {
            const mockCrew_list = [mockCrew];
            const query: CrewQueryDto = { page: 1, perPage: 12 };

            jest.spyOn(prisma.crew, "findMany").mockResolvedValue(mockCrew_list);
            (mockPrismaService.crewReview.groupBy as jest.Mock).mockResolvedValue([
                { crewId: mockCrew.id, _avg: { rating: 4.7 }, _count: { rating: 62 } },
            ]);
            jest.spyOn(prisma.crew, "count").mockResolvedValue(1);
            jest.spyOn(prisma.userCrewFavorite, "findFirst").mockResolvedValue(null);

            const result = await service.findAll(query);

            expect(result).toBeDefined();
            expect(result.crew).toHaveLength(1);
            expect(result.count).toBe(1);
        });
    });

    describe("findOne", () => {
        it("should return a crew member by id", async () => {
            jest.spyOn(prisma.crew, "findFirst").mockResolvedValue(mockCrew);
            (mockPrismaService.crewReview.groupBy as jest.Mock).mockResolvedValue([
                { crewId: mockCrew.id, _avg: { rating: 4.7 }, _count: { rating: 62 } },
            ]);
            jest.spyOn(prisma.userCrewFavorite, "findFirst").mockResolvedValue(null);

            const result = await service.findOne(mockCrew.id);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockCrew.id);
        });

        it("should throw NotFoundException when crew member is not found", async () => {
            jest.spyOn(prisma.crew, "findFirst").mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe("create", () => {
        it("should create a new crew member", async () => {
            const createDto: CreateCrewDto = {
                fullname: "Steven Spielberg",
                role: "Director",
                description: "American filmmaker",
                photoSrc: "http://example.com/photo.jpg",
                photoSrcProd: "http://example.com/photo-prod.jpg",
                debut: "1971",
            };

            jest.spyOn(prisma.crew, "create").mockResolvedValue(mockCrew);

            const result = await service.create(createDto);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockCrew.id);
        });
    });

    describe("update", () => {
        it("should update a crew member", async () => {
            const updateDto: UpdateCrewDto = { fullname: "James Cameron" };

            jest.spyOn(prisma.crew, "findFirst").mockResolvedValue(mockCrew);
            jest.spyOn(prisma.crew, "update").mockResolvedValue({
                ...mockCrew,
                fullname: "james cameron",
            });

            const result = await service.update(mockCrew.id, updateDto);

            expect(result).toBeDefined();
        });

        it("should throw NotFoundException when crew member is not found", async () => {
            jest.spyOn(prisma.crew, "findFirst").mockResolvedValue(null);

            await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
        });
    });

    describe("remove", () => {
        it("should delete a crew member", async () => {
            jest.spyOn(prisma.crew, "findFirst").mockResolvedValue(mockCrew);
            jest.spyOn(prisma.crew, "delete").mockResolvedValue(mockCrew);

            await service.remove(mockCrew.id);

            expect(prisma.crew.delete).toHaveBeenCalled();
        });

        it("should throw NotFoundException when crew member is not found", async () => {
            jest.spyOn(prisma.crew, "findFirst").mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});
