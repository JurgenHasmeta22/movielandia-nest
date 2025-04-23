/*
  Warnings:

  - You are about to drop the `DownvoteForumPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DownvoteForumReply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DownvoteForumTopic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `editCount` on the `ForumPost` table. All the data in the column will be lost.
  - You are about to drop the column `lastEditAt` on the `ForumPost` table. All the data in the column will be lost.
  - You are about to drop the column `editCount` on the `ForumReply` table. All the data in the column will be lost.
  - You are about to drop the column `lastEditAt` on the `ForumReply` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "DownvoteForumPost_userId_postId_key";

-- DropIndex
DROP INDEX "DownvoteForumReply_userId_replyId_key";

-- DropIndex
DROP INDEX "DownvoteForumTopic_userId_topicId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DownvoteForumPost";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DownvoteForumReply";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DownvoteForumTopic";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ForumPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Normal',
    "isAnswer" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "answeredAt" DATETIME,
    "deletedAt" DATETIME,
    "topicId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "answeredById" INTEGER,
    "deletedById" INTEGER,
    CONSTRAINT "ForumPost_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ForumPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ForumPost_answeredById_fkey" FOREIGN KEY ("answeredById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ForumPost_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ForumPost" ("answeredAt", "answeredById", "content", "createdAt", "deletedAt", "deletedById", "id", "isAnswer", "isDeleted", "isEdited", "isModerated", "slug", "topicId", "type", "updatedAt", "userId") SELECT "answeredAt", "answeredById", "content", "createdAt", "deletedAt", "deletedById", "id", "isAnswer", "isDeleted", "isEdited", "isModerated", "slug", "topicId", "type", "updatedAt", "userId" FROM "ForumPost";
DROP TABLE "ForumPost";
ALTER TABLE "new_ForumPost" RENAME TO "ForumPost";
CREATE UNIQUE INDEX "ForumPost_slug_key" ON "ForumPost"("slug");
CREATE INDEX "ForumPost_createdAt_idx" ON "ForumPost"("createdAt");
CREATE INDEX "ForumPost_isModerated_idx" ON "ForumPost"("isModerated");
CREATE INDEX "ForumPost_topicId_idx" ON "ForumPost"("topicId");
CREATE INDEX "ForumPost_isDeleted_idx" ON "ForumPost"("isDeleted");
CREATE INDEX "ForumPost_answeredAt_idx" ON "ForumPost"("answeredAt");
CREATE TABLE "new_ForumReply" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ForumReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ForumReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ForumReply" ("content", "createdAt", "id", "isEdited", "isModerated", "postId", "updatedAt", "userId") SELECT "content", "createdAt", "id", "isEdited", "isModerated", "postId", "updatedAt", "userId" FROM "ForumReply";
DROP TABLE "ForumReply";
ALTER TABLE "new_ForumReply" RENAME TO "ForumReply";
CREATE INDEX "ForumReply_createdAt_idx" ON "ForumReply"("createdAt");
CREATE INDEX "ForumReply_isModerated_idx" ON "ForumReply"("isModerated");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
