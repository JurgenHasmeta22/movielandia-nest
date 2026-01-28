import { Test, TestingModule } from "@nestjs/testing";
import { ForumController } from "./forum.controller";
import { ForumService } from "./forum.service";
import {
    mockForumCategory,
    mockForumTopic,
    mockForumPost,
    mockForumTopicWithRelations,
    mockForumPostWithRelations,
} from "./forum.mock-data";

describe("ForumController", () => {
    let controller: ForumController;
    let service: ForumService;

    const mockForumService = {
        findAllCategories: jest.fn(),
        findCategoryById: jest.fn(),
        createCategory: jest.fn(),
        updateCategory: jest.fn(),
        deleteCategory: jest.fn(),
        findTopicById: jest.fn(),
        findTopicsByCategory: jest.fn(),
        createTopic: jest.fn(),
        updateTopic: jest.fn(),
        deleteTopic: jest.fn(),
        findPostById: jest.fn(),
        findPostsByTopic: jest.fn(),
        createPost: jest.fn(),
        updatePost: jest.fn(),
        deletePost: jest.fn(),
        incrementViewCount: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ForumController],
            providers: [
                {
                    provide: ForumService,
                    useValue: mockForumService,
                },
            ],
        }).compile();

        controller = module.get<ForumController>(ForumController);
        service = module.get<ForumService>(ForumService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("findAllCategories", () => {
        it("should return a list of categories", async () => {
            const mockResult = [mockForumCategory];

            jest.spyOn(service, "findAllCategories").mockResolvedValue(mockResult);

            const result = await controller.findAllCategories();

            expect(result).toEqual(mockResult);
            expect(service.findAllCategories).toHaveBeenCalled();
        });
    });

    describe("findCategoryById", () => {
        it("should return a category by id", async () => {
            const mockResult = { ...mockForumCategory, topics: [] };

            jest.spyOn(service, "findCategoryById").mockResolvedValue(mockResult as any);

            const result = await controller.findCategoryById(1);

            expect(result).toEqual(mockResult);
            expect(service.findCategoryById).toHaveBeenCalledWith(1);
        });

        it("should throw not found when category does not exist", () => {
            jest.spyOn(service, "findCategoryById").mockRejectedValue(new Error("Not found"));

            expect(() => controller.findCategoryById(999)).rejects.toThrow();
        });
    });

    describe("createCategory", () => {
        it("should create a new category", async () => {
            const createCategoryDto = { name: "New Category", description: "Test", slug: "new-category", order: 2 };
            const mockResult = mockForumCategory;

            jest.spyOn(service, "createCategory").mockResolvedValue(mockResult);

            const result = await controller.createCategory(createCategoryDto as any);

            expect(result).toEqual(mockResult);
            expect(service.createCategory).toHaveBeenCalledWith(createCategoryDto);
        });
    });

    describe("findTopicById", () => {
        it("should return a topic by id", async () => {
            const mockResult = mockForumTopicWithRelations;

            jest.spyOn(service, "findTopicById").mockResolvedValue(mockResult as any);
            jest.spyOn(service, "incrementViewCount").mockResolvedValue(mockResult as any);

            const result = await controller.findTopicById(1);

            expect(result).toEqual(mockResult);
            expect(service.incrementViewCount).toHaveBeenCalledWith(1);
            expect(service.findTopicById).toHaveBeenCalledWith(1);
        });
    });

    describe("createTopic", () => {
        it("should create a new topic", async () => {
            const createTopicDto = { categoryId: 1, title: "New Topic", content: "Test content" };
            const mockResult = mockForumTopicWithRelations;

            jest.spyOn(service, "createTopic").mockResolvedValue(mockResult as any);

            const result = await controller.createTopic({ id: 1 } as any, createTopicDto as any);

            expect(result).toEqual(mockResult);
            expect(service.createTopic).toHaveBeenCalledWith(1, createTopicDto);
        });
    });

    describe("createPost", () => {
        it("should create a new post", async () => {
            const createPostDto = { topicId: 1, content: "Test content" };
            const mockResult = mockForumPostWithRelations;

            jest.spyOn(service, "createPost").mockResolvedValue(mockResult as any);

            const result = await controller.createPost({ id: 1 } as any, createPostDto as any);

            expect(result).toEqual(mockResult);
            expect(service.createPost).toHaveBeenCalledWith(1, createPostDto);
        });
    });

    describe("deletePost", () => {
        it("should delete a post", async () => {
            const mockResult = { ...mockForumPost, isDeleted: true };

            jest.spyOn(service, "deletePost").mockResolvedValue(mockResult as any);

            await controller.deletePost(1);

            expect(service.deletePost).toHaveBeenCalledWith(1);
        });
    });
});
