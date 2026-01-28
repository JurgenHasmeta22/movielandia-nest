import { Test, TestingModule } from "@nestjs/testing";
import { ForumService } from "./forum.service";
import { PrismaService } from "../../prisma.service";
import { CreateForumCategoryDto, UpdateForumCategoryDto } from "./dtos/forum-category.dto";
import { CreateForumTopicDto, UpdateForumTopicDto } from "./dtos/forum-topic.dto";
import { CreateForumPostDto, UpdateForumPostDto } from "./dtos/forum-post.dto";
import { NotFoundException } from "@nestjs/common";
import { mockForumCategory, mockForumTopic, mockForumPost } from "./forum.mock-data";

describe("ForumService", () => {
    let service: ForumService;
    let prisma: PrismaService;

    const mockPrismaService = {
        forumCategory: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        forumTopic: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        forumPost: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ForumService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ForumService>(ForumService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findAllCategories", () => {
        it("should return a list of categories", async () => {
            const mockResult = [mockForumCategory];

            jest.spyOn(prisma.forumCategory, "findMany").mockResolvedValue(mockResult);

            const result = await service.findAllCategories();

            expect(result).toEqual(mockResult);
            expect(prisma.forumCategory.findMany).toHaveBeenCalledWith({
                where: { isActive: true },
                orderBy: { order: "asc" },
            });
        });
    });

    describe("findCategoryById", () => {
        it("should return a category by id", async () => {
            jest.spyOn(prisma.forumCategory, "findUnique").mockResolvedValue(mockForumCategory);

            const result = await service.findCategoryById(1);

            expect(result).toEqual(mockForumCategory);
            expect(prisma.forumCategory.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { topics: true },
            });
        });

        it("should throw not found when category does not exist", async () => {
            jest.spyOn(prisma.forumCategory, "findUnique").mockResolvedValue(null);

            await expect(service.findCategoryById(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe("createCategory", () => {
        it("should create a new category", async () => {
            const createCategoryDto: CreateForumCategoryDto = {
                name: "New Category",
                description: "Test",
                slug: "new-category",
                order: 2,
            };

            jest.spyOn(prisma.forumCategory, "create").mockResolvedValue(mockForumCategory);

            const result = await service.createCategory(createCategoryDto);

            expect(result).toEqual(mockForumCategory);
            expect(prisma.forumCategory.create).toHaveBeenCalledWith({
                data: createCategoryDto,
            });
        });
    });

    describe("updateCategory", () => {
        it("should update a category", async () => {
            const updateCategoryDto: UpdateForumCategoryDto = { name: "Updated Category" };
            const updatedCategory = { ...mockForumCategory, name: "Updated Category" };

            jest.spyOn(prisma.forumCategory, "findUnique").mockResolvedValue(mockForumCategory);
            jest.spyOn(prisma.forumCategory, "update").mockResolvedValue(updatedCategory);

            const result = await service.updateCategory(1, updateCategoryDto);

            expect(result).toEqual(updatedCategory);
        });
    });

    describe("deleteCategory", () => {
        it("should delete a category", async () => {
            jest.spyOn(prisma.forumCategory, "findUnique").mockResolvedValue(mockForumCategory);
            jest.spyOn(prisma.forumCategory, "delete").mockResolvedValue(mockForumCategory);

            await service.deleteCategory(1);

            expect(prisma.forumCategory.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });
    });

    describe("findTopicById", () => {
        it("should return a topic by id", async () => {
            jest.spyOn(prisma.forumTopic, "findUnique").mockResolvedValue(mockForumTopic as any);

            const result = await service.findTopicById(1);

            expect(result).toEqual(mockForumTopic);
        });

        it("should throw not found when topic does not exist", async () => {
            jest.spyOn(prisma.forumTopic, "findUnique").mockResolvedValue(null);

            await expect(service.findTopicById(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe("findPostById", () => {
        it("should return a post by id", async () => {
            jest.spyOn(prisma.forumPost, "findUnique").mockResolvedValue(mockForumPost as any);

            const result = await service.findPostById(1);

            expect(result).toEqual(mockForumPost);
        });

        it("should throw not found when post does not exist", async () => {
            jest.spyOn(prisma.forumPost, "findUnique").mockResolvedValue(null);

            await expect(service.findPostById(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe("createTopic", () => {
        it("should create a new topic", async () => {
            const createTopicDto: CreateForumTopicDto = {
                categoryId: 1,
                title: "New Topic",
                content: "Test content",
            };

            jest.spyOn(prisma.forumTopic, "create").mockResolvedValue(mockForumTopic as any);

            const result = await service.createTopic(1, createTopicDto);

            expect(result).toEqual(mockForumTopic);
        });
    });

    describe("createPost", () => {
        it("should create a new post", async () => {
            const createPostDto: CreateForumPostDto = {
                topicId: 1,
                content: "Test content",
            };

            jest.spyOn(prisma.forumPost, "create").mockResolvedValue(mockForumPost as any);

            const result = await service.createPost(1, createPostDto);

            expect(result).toEqual(mockForumPost);
        });
    });

    describe("deletePost", () => {
        it("should soft delete a post", async () => {
            const deletedPost = { ...mockForumPost, isDeleted: true, deletedAt: new Date() };

            jest.spyOn(prisma.forumPost, "findUnique").mockResolvedValue(mockForumPost as any);
            jest.spyOn(prisma.forumPost, "update").mockResolvedValue(deletedPost as any);

            await service.deletePost(1);

            expect(prisma.forumPost.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { isDeleted: true, deletedAt: expect.any(Date) },
            });
        });
    });

    describe("incrementViewCount", () => {
        it("should increment view count", async () => {
            const incrementedTopic = { ...mockForumTopic, viewCount: 101 };

            jest.spyOn(prisma.forumTopic, "update").mockResolvedValue(incrementedTopic as any);

            const result = await service.incrementViewCount(1);

            expect(result).toEqual(incrementedTopic);
            expect(prisma.forumTopic.update).toHaveBeenCalled();
        });
    });
});
