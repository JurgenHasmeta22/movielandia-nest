import { Test, TestingModule } from "@nestjs/testing";
import { ListService } from "./list.service";
import { PrismaService } from "../../prisma.service";
import { CreateListDto, UpdateListDto, CreateListShareDto } from "./dtos/list.dto";
import { AddListItemDto } from "./dtos/list-item.dto";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockList, mockListWithItems } from "./list.mock-data";

describe("ListService", () => {
    let service: ListService;
    let prisma: PrismaService;

    const mockPrismaService = {
        list: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        listMovie: {
            create: jest.fn(),
            deleteMany: jest.fn(),
        },
        listSerie: {
            create: jest.fn(),
            deleteMany: jest.fn(),
        },
        listSeason: {
            create: jest.fn(),
        },
        listEpisode: {
            create: jest.fn(),
        },
        listActor: {
            create: jest.fn(),
        },
        listCrew: {
            create: jest.fn(),
        },
        listShare: {
            create: jest.fn(),
            deleteMany: jest.fn(),
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ListService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ListService>(ListService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findListById", () => {
        it("should return a list by id", async () => {
            jest.spyOn(prisma.list, "findUnique").mockResolvedValue(mockListWithItems);

            const result = await service.findListById(1);

            expect(result).toEqual(mockListWithItems);
            expect(prisma.list.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    movieItems: true,
                    serieItems: true,
                    seasonItems: true,
                    episodeItems: true,
                    actorItems: true,
                    crewItems: true,
                    sharedWith: true,
                },
            });
        });

        it("should throw not found when list does not exist", async () => {
            jest.spyOn(prisma.list, "findUnique").mockResolvedValue(null);

            await expect(service.findListById(999)).rejects.toThrow(NotFoundException);
        });

        it("should throw error when accessing private list without permission", async () => {
            const privateList = { ...mockList, isPrivate: true, userId: 999 };
            jest.spyOn(prisma.list, "findUnique").mockResolvedValue(privateList as any);

            await expect(service.findListById(1, 1)).rejects.toThrow(BadRequestException);
        });
    });

    describe("createList", () => {
        it("should create a new list", async () => {
            const createListDto: CreateListDto = { name: "New List", description: "Test", isPrivate: false };
            jest.spyOn(prisma.list, "create").mockResolvedValue(mockList);

            const result = await service.createList(1, createListDto);

            expect(result).toEqual(mockList);
            expect(prisma.list.create).toHaveBeenCalledWith({
                data: {
                    ...createListDto,
                    userId: 1,
                },
            });
        });
    });

    describe("updateList", () => {
        it("should update a list", async () => {
            const updateListDto: UpdateListDto = { name: "Updated List" };
            const updatedList = { ...mockList, name: "Updated List" };

            jest.spyOn(prisma.list, "findUnique").mockResolvedValue(mockList);
            jest.spyOn(prisma.list, "update").mockResolvedValue(updatedList);

            const result = await service.updateList(1, 1, updateListDto);

            expect(result).toEqual(updatedList);
        });

        it("should throw error when updating someone else's list", async () => {
            const privateList = { ...mockList, userId: 999 };
            jest.spyOn(prisma.list, "findUnique").mockResolvedValue(privateList as any);

            await expect(service.updateList(1, 1, {})).rejects.toThrow(BadRequestException);
        });
    });

    describe("deleteList", () => {
        it("should delete a list", async () => {
            jest.spyOn(prisma.list, "findUnique").mockResolvedValue(mockList);
            jest.spyOn(prisma.list, "delete").mockResolvedValue(mockList);

            await service.deleteList(1, 1);

            expect(prisma.list.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });
    });

    describe("addMovieToList", () => {
        it("should add a movie to list", async () => {
            const addListItemDto: AddListItemDto = { contentId: 1, note: "Great movie" };

            jest.spyOn(prisma.list, "findUnique").mockResolvedValue(mockList);
            jest.spyOn(prisma.listMovie, "create").mockResolvedValue({} as any);

            await service.addMovieToList(1, 1, addListItemDto);

            expect(prisma.listMovie.create).toHaveBeenCalled();
        });
    });

    describe("shareList", () => {
        it("should share a list with another user", async () => {
            const createListShareDto: CreateListShareDto = { userId: 2, canEdit: true };

            jest.spyOn(prisma.list, "findUnique").mockResolvedValue(mockList);
            jest.spyOn(prisma.listShare, "create").mockResolvedValue({} as any);

            await service.shareList(1, 1, createListShareDto);

            expect(prisma.listShare.create).toHaveBeenCalled();
        });

        it("should throw error when sharing someone else's list", async () => {
            const privateList = { ...mockList, userId: 999 };
            jest.spyOn(prisma.list, "findUnique").mockResolvedValue(privateList as any);

            await expect(service.shareList(1, 1, { userId: 2 } as any)).rejects.toThrow(BadRequestException);
        });
    });
});
