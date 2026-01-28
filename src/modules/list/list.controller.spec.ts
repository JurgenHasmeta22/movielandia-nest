import { Test, TestingModule } from "@nestjs/testing";
import { ListController } from "./list.controller";
import { ListService } from "./list.service";
import { mockList, mockListWithItems } from "./list.mock-data";

describe("ListController", () => {
    let controller: ListController;
    let service: ListService;

    const mockListService = {
        findAllByUser: jest.fn(),
        findListById: jest.fn(),
        createList: jest.fn(),
        updateList: jest.fn(),
        deleteList: jest.fn(),
        addMovieToList: jest.fn(),
        addSeriesToList: jest.fn(),
        addSeasonToList: jest.fn(),
        addEpisodeToList: jest.fn(),
        addActorToList: jest.fn(),
        addCrewToList: jest.fn(),
        removeMovieFromList: jest.fn(),
        removeSeriesFromList: jest.fn(),
        shareList: jest.fn(),
        unshareList: jest.fn(),
        getSharedWithMe: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ListController],
            providers: [
                {
                    provide: ListService,
                    useValue: mockListService,
                },
            ],
        }).compile();

        controller = module.get<ListController>(ListController);
        service = module.get<ListService>(ListService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("findAllByUser", () => {
        it("should return a list of user lists", async () => {
            const mockResult = [mockList];

            jest.spyOn(service, "findAllByUser").mockResolvedValue(mockResult);

            const result = await controller.findAllByUser({ id: 1 } as any);

            expect(result).toEqual(mockResult);
            expect(service.findAllByUser).toHaveBeenCalledWith(1);
        });
    });

    describe("findListById", () => {
        it("should return a list by id", async () => {
            const mockResult = mockList;

            jest.spyOn(service, "findListById").mockResolvedValue(mockResult as any);

            const result = await controller.findListById(1);

            expect(result).toEqual(mockResult);
            expect(service.findListById).toHaveBeenCalledWith(1, undefined);
        });

        it("should throw not found when list does not exist", () => {
            jest.spyOn(service, "findListById").mockRejectedValue(new Error("Not found"));

            expect(() => controller.findListById(999)).rejects.toThrow();
        });
    });

    describe("createList", () => {
        it("should create a new list", async () => {
            const createListDto = { title: "New List", description: "Test", isPrivate: false };
            const mockResult = mockList;

            jest.spyOn(service, "createList").mockResolvedValue(mockResult);

            const result = await controller.createList({ id: 1 } as any, createListDto as any);

            expect(result).toEqual(mockResult);
            expect(service.createList).toHaveBeenCalledWith(1, createListDto);
        });
    });

    describe("updateList", () => {
        it("should update a list", async () => {
            const updateListDto = { title: "Updated List" };
            const mockResult = { ...mockList, title: "Updated List" };

            jest.spyOn(service, "updateList").mockResolvedValue(mockResult);

            const result = await controller.updateList(1, { id: 1 } as any, updateListDto as any);

            expect(result).toEqual(mockResult);
            expect(service.updateList).toHaveBeenCalledWith(1, 1, updateListDto);
        });
    });

    describe("deleteList", () => {
        it("should delete a list", async () => {
            jest.spyOn(service, "deleteList").mockResolvedValue(undefined);

            await controller.deleteList(1, { id: 1 } as any);

            expect(service.deleteList).toHaveBeenCalledWith(1, 1);
        });
    });

    describe("getSharedWithMe", () => {
        it("should return lists shared with user", async () => {
            const mockResult = [];

            jest.spyOn(service, "getSharedWithMe").mockResolvedValue(mockResult);

            const result = await controller.getSharedWithMe({ id: 1 } as any);

            expect(result).toEqual(mockResult);
            expect(service.getSharedWithMe).toHaveBeenCalledWith(1);
        });
    });
});
