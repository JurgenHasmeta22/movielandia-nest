import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { forumCategories } from "./data/forumData";

const prisma = new PrismaClient();

export async function generateForumData(): Promise<void> {
    console.log("Generating forum data...");

    const users = await prisma.user.findMany({ select: { id: true } });
    const existingCategoriesCount = await prisma.forumCategory.count();
    const existingTopicsCount = await prisma.forumTopic.count();
    const existingPostsCount = await prisma.forumPost.count();

    console.log(`Existing forum data counts:
      - Categories: ${existingCategoriesCount}
      - Topics: ${existingTopicsCount}
      - Posts: ${existingPostsCount}
    `);

    if (existingCategoriesCount === 0) {
        console.log("Generating forum categories...");
        
        for (const category of forumCategories) {
            await prisma.forumCategory.create({
                data: category
            });
        }

        console.log(`Created ${forumCategories.length} forum categories.`);
    }

    const categories = await prisma.forumCategory.findMany();

    console.log("Generating forum topics...");
    
    for (const category of categories) {
        const topicCount = Math.floor(Math.random() * 8) + 3; // 3-10 topics per category
        
        for (let i = 0; i < topicCount; i++) {
            const userId = faker.helpers.arrayElement(users).id;
            const isPinned = Math.random() < 0.2; // 20% chance of being pinned
            const isLocked = Math.random() < 0.1; // 10% chance of being locked
            
            const title = faker.lorem.sentence().replace(/\\.$/, '');
            const content = `<p>${faker.lorem.paragraphs(3).replace(/\\n/g, '</p><p>')}</p>`;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            
            try {
                const topic = await prisma.forumTopic.create({
                    data: {
                        title,
                        content,
                        slug,
                        isPinned,
                        isLocked,
                        viewCount: Math.floor(Math.random() * 100),
                        categoryId: category.id,
                        userId,
                    }
                });
                
                // Generate posts for each topic
                const postCount = Math.floor(Math.random() * 15) + 2; // 2-16 posts per topic
                
                for (let j = 0; j < postCount; j++) {
                    const postUserId = faker.helpers.arrayElement(users).id;
                    const postContent = `<p>${faker.lorem.paragraphs(2).replace(/\\n/g, '</p><p>')}</p>`;
                    const isEdited = Math.random() < 0.3; // 30% chance of being edited
                    
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
                        

                        await prisma.forumTopic.update({
                            where: { id: topic.id },
                            data: { lastPostAt: post.createdAt }
                        });
                        
                        const upvoteCount = Math.floor(Math.random() * 5);
                        const downvoteCount = Math.floor(Math.random() * 3);
                        const availableUsers = users.filter(u => u.id !== postUserId);
                        const upvoters = faker.helpers.arrayElements(availableUsers, upvoteCount);
                        
                        for (const upvoter of upvoters) {
                            await prisma.upvoteForumPost.create({
                                data: {
                                    userId: upvoter.id,
                                    postId: post.id
                                }
                            });
                        }
                        
                        const remainingUsers = availableUsers.filter(u => !upvoters.some(upvoter => upvoter.id === u.id));
                        const downvoters = faker.helpers.arrayElements(remainingUsers, downvoteCount);
                        
                        for (const downvoter of downvoters) {
                            await prisma.downvoteForumPost.create({
                                data: {
                                    userId: downvoter.id,
                                    postId: post.id
                                }
                            });
                        }
                        
                        if (Math.random() < 0.4) {
                            const replyCount = Math.floor(Math.random() * 3) + 1;
                            
                            for (let k = 0; k < replyCount; k++) {
                                const replyUserId = faker.helpers.arrayElement(users).id;
                                const replyContent = `<p>${faker.lorem.paragraph()}</p>`;
                                
                                await prisma.forumReply.create({
                                    data: {
                                        content: replyContent,
                                        postId: post.id,
                                        userId: replyUserId,
                                    }
                                });
                            }
                        }
                    } catch (error) {
                        console.error(`Error creating post for topic ${topic.id}:`, error);
                    }
                }
                
                await prisma.forumCategory.update({
                    where: { id: category.id },
                    data: {
                        topicCount: { increment: 1 },
                        postCount: { increment: postCount },
                        lastPostAt: new Date(),
                    }
                });
                
            } catch (error) {
                console.error(`Error creating topic for category ${category.id}:`, error);
            }
        }
    }

    console.log("Updating user forum statistics...");
    
    for (const user of users) {
        const topicCount = await prisma.forumTopic.count({ where: { userId: user.id } });
        const postCount = await prisma.forumPost.count({ where: { userId: user.id } });
        const replyCount = await prisma.forumReply.count({ where: { userId: user.id } });
        
        const upvotesReceived = await prisma.upvoteForumPost.count({
            where: {
                post: {
                    userId: user.id
                }
            }
        });
        
        const reputation = topicCount * 5 + postCount * 2 + replyCount + upvotesReceived * 3;
        
        const lastPost = await prisma.forumPost.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true }
        });
        
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

    console.log("Successfully generated forum data.");
}
