import { ForumCategory, ForumTopic, ForumPost } from "@prisma/client";

export class ForumMapper {
    static categoryToDto(category: ForumCategory) {
        return {
            id: category.id,
            name: category.name,
            description: category.description,
            slug: category.slug,
            order: category.order,
            isActive: category.isActive,
            topicCount: category.topicCount,
            postCount: category.postCount,
            lastPostAt: category.lastPostAt,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    }

    static topicToDto(topic: ForumTopic) {
        return {
            id: topic.id,
            categoryId: topic.categoryId,
            title: topic.title,
            slug: topic.slug,
            content: topic.content,
            isPinned: topic.isPinned,
            isLocked: topic.isLocked,
            viewCount: topic.viewCount,
            lastPostAt: topic.lastPostAt,
            createdAt: topic.createdAt,
            updatedAt: topic.updatedAt,
        };
    }

    static postToDto(post: ForumPost) {
        return {
            id: post.id,
            topicId: post.topicId,
            content: post.content,
            type: post.type,
            isEdited: post.isEdited,
            isDeleted: post.isDeleted,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    }
}
