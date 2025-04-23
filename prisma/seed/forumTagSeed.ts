import { PrismaClient } from "@prisma/client";
import { forumTags } from "./data/forumTagData";

const prisma = new PrismaClient();

export async function generateForumTagData(): Promise<void> {
    console.log("Generating forum tag data...");
    const existingTagsCount = await prisma.forumTag.count();
    console.log(`Existing forum tags count: ${existingTagsCount}`);

    if (existingTagsCount === 0) {
        console.log("Generating forum tags...");
        
        for (const tag of forumTags) {
            await prisma.forumTag.create({
                data: tag
            });
        }

        console.log(`Created ${forumTags.length} forum tags.`);
    } else {
        console.log("Forum tags already exist, skipping tag creation.");
    }

    const topics = await prisma.forumTopic.findMany({
        select: { id: true }
    });
    
    const tags = await prisma.forumTag.findMany({
        select: { id: true }
    });

    const topicsWithTags = await prisma.forumTopic.findMany({
        where: {
            tags: {
                some: {}
            }
        },
        select: { id: true }
    });

    const topicsWithTagsIds = new Set(topicsWithTags.map(topic => topic.id));
    console.log(`Found ${topics.length} topics, ${topicsWithTagsIds.size} already have tags.`);
    console.log("Assigning tags to topics...");
    let assignedCount = 0;
    
    for (const topic of topics) {
        if (topicsWithTagsIds.has(topic.id)) {
            continue;
        }
        
        const tagCount = Math.floor(Math.random() * 3) + 1;
        const selectedTagIds = [];
        const shuffledTags = [...tags].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < Math.min(tagCount, shuffledTags.length); i++) {
            selectedTagIds.push(shuffledTags[i].id);
        }
        
        await prisma.forumTopic.update({
            where: { id: topic.id },
            data: {
                tags: {
                    connect: selectedTagIds.map(id => ({ id }))
                }
            }
        });
        
        assignedCount++;
        
        if (assignedCount % 10 === 0) {
            console.log(`Assigned tags to ${assignedCount} topics...`);
        }
    }

    console.log(`Successfully assigned tags to ${assignedCount} topics.`);
    console.log("Forum tag seeding completed successfully.");
}

if (require.main === module) {
    generateForumTagData()
        .then(async () => {
            await prisma.$disconnect();
        })
        .catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
            process.exit(1);
        });
}
