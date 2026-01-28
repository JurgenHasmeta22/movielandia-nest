import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CreateForumCategoryDto, UpdateForumCategoryDto } from "./dtos/forum-category.dto";
import { CreateForumTopicDto, UpdateForumTopicDto } from "./dtos/forum-topic.dto";
import { CreateForumPostDto, UpdateForumPostDto } from "./dtos/forum-post.dto";

@Injectable()
export class ForumService {
    constructor(private readonly prisma: PrismaService) {}

    async findAllCategories() {
        return this.prisma.forumCategory.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        });
    }

    async findCategoryById(id: number) {
        const category = await this.prisma.forumCategory.findUnique({
            where: { id },
            include: { topics: true },
        });

        if (!category) {
            throw new NotFoundException(`Forum category with id ${id} not found`);
        }

        return category;
    }

    async createCategory(createForumCategoryDto: CreateForumCategoryDto) {
        return this.prisma.forumCategory.create({
            data: createForumCategoryDto,
        });
    }

    async updateCategory(id: number, updateForumCategoryDto: UpdateForumCategoryDto) {
        await this.findCategoryById(id);

        return this.prisma.forumCategory.update({
            where: { id },
            data: updateForumCategoryDto,
        });
    }

    async deleteCategory(id: number) {
        await this.findCategoryById(id);

        return this.prisma.forumCategory.delete({
            where: { id },
        });
    }

    async findTopicById(id: number) {
        const topic = await this.prisma.forumTopic.findUnique({
            where: { id },
            include: {
                user: true,
                category: true,
                tags: true,
                posts: true,
            },
        });

        if (!topic) {
            throw new NotFoundException(`Forum topic with id ${id} not found`);
        }

        return topic;
    }

    async findTopicsByCategory(categoryId: number, page: number = 1, perPage: number = 20) {
        const skip = (page - 1) * perPage;

        const topics = await this.prisma.forumTopic.findMany({
            where: { categoryId },
            skip,
            take: perPage,
            orderBy: { createdAt: "desc" },
            include: { user: true, posts: true },
        });

        const count = await this.prisma.forumTopic.count({ where: { categoryId } });

        return { topics, count };
    }

    async createTopic(userId: number, createForumTopicDto: CreateForumTopicDto) {
        return this.prisma.forumTopic.create({
            data: {
                ...createForumTopicDto,
                userId,
                slug: createForumTopicDto.title.toLowerCase().replace(/\s+/g, "-"),
            },
            include: { user: true, category: true, tags: true },
        });
    }

    async updateTopic(id: number, updateForumTopicDto: UpdateForumTopicDto) {
        await this.findTopicById(id);

        return this.prisma.forumTopic.update({
            where: { id },
            data: updateForumTopicDto,
            include: { user: true, category: true, tags: true },
        });
    }

    async deleteTopic(id: number) {
        await this.findTopicById(id);

        return this.prisma.forumTopic.delete({
            where: { id },
        });
    }

    async findPostById(id: number) {
        const post = await this.prisma.forumPost.findUnique({
            where: { id },
            include: {
                user: true,
                topic: true,
                attachments: true,
                replies: true,
            },
        });

        if (!post) {
            throw new NotFoundException(`Forum post with id ${id} not found`);
        }

        return post;
    }

    async findPostsByTopic(topicId: number, page: number = 1, perPage: number = 20) {
        const skip = (page - 1) * perPage;

        const posts = await this.prisma.forumPost.findMany({
            where: { topicId, isDeleted: false },
            skip,
            take: perPage,
            orderBy: { createdAt: "asc" },
            include: { user: true, attachments: true, replies: true },
        });

        const count = await this.prisma.forumPost.count({
            where: { topicId, isDeleted: false },
        });

        return { posts, count };
    }

    async createPost(userId: number, createForumPostDto: CreateForumPostDto) {
        return this.prisma.forumPost.create({
            data: {
                ...createForumPostDto,
                userId,
                slug: `post-${Date.now()}`,
            },
            include: { user: true, topic: true, attachments: true },
        });
    }

    async updatePost(id: number, updateForumPostDto: UpdateForumPostDto) {
        await this.findPostById(id);

        return this.prisma.forumPost.update({
            where: { id },
            data: {
                ...updateForumPostDto,
                isEdited: true,
            },
            include: { user: true, topic: true, attachments: true },
        });
    }

    async deletePost(id: number) {
        await this.findPostById(id);

        return this.prisma.forumPost.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() },
        });
    }

    async incrementViewCount(topicId: number) {
        return this.prisma.forumTopic.update({
            where: { id: topicId },
            data: { viewCount: { increment: 1 } },
        });
    }
}
