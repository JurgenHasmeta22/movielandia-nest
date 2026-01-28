import { ForumCategory, ForumTopic, ForumPost } from "@prisma/client";
import { IForumCategoryWithTopics, IForumTopicWithRelations, IForumPostWithRelations } from "./forum.interface";

export const mockForumCategory: ForumCategory = {
    id: 1,
    name: "General Discussion",
    description: "General forum discussions",
    slug: "general-discussion",
    order: 1,
    isActive: true,
    topicCount: 0,
    postCount: 0,
    lastPostId: null,
    lastPostAt: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
};

export const mockForumCategoryWithTopics: IForumCategoryWithTopics = {
    ...mockForumCategory,
    topics: [],
};

export const mockForumTopic: ForumTopic = {
    id: 1,
    categoryId: 1,
    userId: 1,
    title: "Best movies of 2024",
    slug: "best-movies-of-2024",
    content: "What are your favorite movies from 2024?",
    viewCount: 100,
    isPinned: false,
    isLocked: false,
    isModerated: false,
    lastPostAt: new Date("2024-01-01"),
    closedAt: null,
    closedById: null,
    status: "Open" as any,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
};

export const mockForumTopicWithRelations: IForumTopicWithRelations = {
    ...mockForumTopic,
    user: undefined,
    category: mockForumCategory,
    tags: [],
    posts: [],
};

export const mockForumPost: ForumPost = {
    id: 1,
    topicId: 1,
    userId: 1,
    content: "I really enjoyed this discussion",
    slug: "post-1234567890",
    type: "Normal" as any,
    isEdited: false,
    isDeleted: false,
    isModerated: false,
    isAnswer: false,
    answeredAt: null,
    answeredById: null,
    deletedAt: null,
    deletedById: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
};

export const mockForumPostWithRelations: IForumPostWithRelations = {
    ...mockForumPost,
    user: undefined,
    topic: mockForumTopic,
    attachments: [],
    replies: [],
};
