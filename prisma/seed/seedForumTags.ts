import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { generateForumTagData } from "./forumTagSeed";

const dbPath = process.env.DATABASE_URL || "file:./prisma/database/movielandia24.db";
const adapter = new PrismaLibSql({ url: dbPath });
const prisma = new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"],
});

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
