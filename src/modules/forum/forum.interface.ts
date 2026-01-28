import { ForumCategory, ForumTopic, ForumPost, ForumTag } from "@prisma/client";

export interface IForumCategory extends ForumCategory {}

export interface IForumTopic extends ForumTopic {}

export interface IForumPost extends ForumPost {}

export interface IForumTag extends ForumTag {}

export interface IForumCategoryWithTopics extends IForumCategory {
    topics?: IForumTopic[];
}

export interface IForumTopicWithRelations extends IForumTopic {
    user?: any;
    category?: IForumCategory;
    tags?: IForumTag[];
    posts?: IForumPost[];
}

export interface IForumPostWithRelations extends IForumPost {
    user?: any;
    topic?: IForumTopic;
    attachments?: any[];
    replies?: IForumPost[];
}

export interface IForumPostsResponse {
    posts: IForumPostWithRelations[];
    count: number;
}

export interface IForumTopicsResponse {
    topics: IForumTopicWithRelations[];
    count: number;
}
