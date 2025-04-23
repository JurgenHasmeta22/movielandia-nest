import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { forumCategories } from "./data/forumData";

const prisma = new PrismaClient();

export async function generateForumDataMinimal(): Promise<void> {
    console.log("Generating minimal forum data for testing...");

    // Get all users
    const users = await prisma.user.findMany({ select: { id: true } });
    const existingCategoriesCount = await prisma.forumCategory.count();
    const existingTopicsCount = await prisma.forumTopic.count();
    const existingPostsCount = await prisma.forumPost.count();

    console.log(`Existing forum data counts:
      - Categories: ${existingCategoriesCount}
      - Topics: ${existingTopicsCount}
      - Posts: ${existingPostsCount}
    `);

    // Generate forum categories if none exist
    if (existingCategoriesCount === 0) {
        console.log("Generating forum categories...");
        
        for (const category of forumCategories) {
            await prisma.forumCategory.create({
                data: category
            });
        }

        console.log(`Created ${forumCategories.length} forum categories.`);
    }

    // Get all categories
    const categories = await prisma.forumCategory.findMany();

    // Generate minimal topics for each category
    console.log("Generating minimal forum topics for testing...");
    
    for (const category of categories) {
        // Create just 1-2 topics per category
        const topicCount = Math.floor(Math.random() * 2) + 1; 
        
        for (let i = 0; i < topicCount; i++) {
            const userId = faker.helpers.arrayElement(users).id;
            const isPinned = i === 0; // First topic is pinned
            const isLocked = i === 1; // Second topic is locked (if it exists)
            
            const title = `${category.name} - Topic ${i + 1}`;
            const content = `<p>This is a test topic for the ${category.name} category.</p><p>It contains some basic content for testing purposes.</p>`;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            
            try {
                const topic = await prisma.forumTopic.create({
                    data: {
                        title,
                        content,
                        slug,
                        isPinned,
                        isLocked,
                        viewCount: Math.floor(Math.random() * 20),
                        categoryId: category.id,
                        userId,
                    }
                });
                
                // Create just 1-3 posts per topic
                const postCount = Math.floor(Math.random() * 3) + 1;
                
                for (let j = 0; j < postCount; j++) {
                    const postUserId = faker.helpers.arrayElement(users).id;
                    const postContent = `<p>This is test post #${j + 1} in this topic.</p>`;
                    const isEdited = j === 1; // Second post is edited (if it exists)
                    
                    try {
                        const post = await prisma.forumPost.create({
                            data: {
                                content: postContent,
                                slug: `post-${Date.now()}-${j}`,
                                isEdited,
                                topicId: topic.id,
                                userId: postUserId,
                            }
                        });
                        
                        // Update the topic with the last post
                        await prisma.forumTopic.update({
                            where: { id: topic.id },
                            data: { lastPostAt: post.createdAt }
                        });
                        
                        // Add just 1 upvote to the first post
                        if (j === 0) {
                            const availableUsers = users.filter(u => u.id !== postUserId);
                            
                            if (availableUsers.length > 0) {
                                const upvoter = faker.helpers.arrayElement(availableUsers);
                                
                                await prisma.upvoteForumPost.create({
                                    data: {
                                        userId: upvoter.id,
                                        postId: post.id
                                    }
                                });
                            }
                        }
                        
                        // Add just 1 reply to the first post
                        if (j === 0) {
                            const replyUserId = faker.helpers.arrayElement(users).id;
                            const replyContent = `<p>This is a test reply.</p>`;
                            
                            await prisma.forumReply.create({
                                data: {
                                    content: replyContent,
                                    postId: post.id,
                                    userId: replyUserId,
                                }
                            });
                        }
                    } catch (error) {
                        console.error(`Error creating post for topic ${topic.id}:`, error);
                    }
                }
                
                // Update category counts
                await prisma.forumCategory.update({
                    where: { id: category.id },
                    data: {
                        topicCount: { increment: 1 },
                        postCount: { increment: postCount },
                        lastPostAt: new Date(),
                    }
                });
                
                console.log(`Created topic "${title}" with ${postCount} posts`);
            } catch (error) {
                console.error(`Error creating topic for category ${category.id}:`, error);
            }
        }
    }

    // Update user forum stats (simplified)
    console.log("Updating user forum statistics...");
    
    for (const user of users) {
        const topicCount = await prisma.forumTopic.count({ where: { userId: user.id } });
        const postCount = await prisma.forumPost.count({ where: { userId: user.id } });
        const replyCount = await prisma.forumReply.count({ where: { userId: user.id } });
        
        // Only create stats for users who have forum activity
        if (topicCount > 0 || postCount > 0 || replyCount > 0) {
            const upvotesReceived = await prisma.upvoteForumPost.count({
                where: {
                    post: {
                        userId: user.id
                    }
                }
            });
            
            // Calculate reputation based on activity and upvotes
            const reputation = topicCount * 5 + postCount * 2 + replyCount + upvotesReceived * 3;
            
            // Get the last post date
            const lastPost = await prisma.forumPost.findFirst({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true }
            });
            
            // Create or update user forum stats
            const existingStats = await prisma.forumUserStats.findFirst({
                where: { userId: user.id }
            });
            
            if (existingStats) {
                await prisma.forumUserStats.update({
                    where: { id: existingStats.id },
                    data: {
                        topicCount,
                        postCount,
                        replyCount,
                        upvotesReceived,
                        reputation,
                        lastPostAt: lastPost?.createdAt || null
                    }
                });
            } else {
                await prisma.forumUserStats.create({
                    data: {
                        userId: user.id,
                        topicCount,
                        postCount,
                        replyCount,
                        upvotesReceived,
                        reputation,
                        lastPostAt: lastPost?.createdAt || null
                    }
                });
            }
        }
    }

    console.log("Successfully generated minimal forum data for testing.");
}
