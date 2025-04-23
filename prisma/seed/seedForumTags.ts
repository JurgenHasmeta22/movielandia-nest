import { PrismaClient } from "@prisma/client";
import { generateForumTagData } from "./forumTagSeed";

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Starting forum tag seeding...");
        await generateForumTagData();
        console.log("Forum tag seeding completed successfully.");
        await prisma.$disconnect();
    } catch (error) {
        console.error("Error during forum tag seeding:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();
