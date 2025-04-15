-- CreateTable
CREATE TABLE "Actor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullname" TEXT NOT NULL,
    "photoSrc" TEXT NOT NULL,
    "photoSrcProd" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "debut" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ActorReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT,
    "rating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    CONSTRAINT "ActorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActorReview_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UpvoteActorReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "actorReviewId" INTEGER NOT NULL,
    CONSTRAINT "UpvoteActorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteActorReview_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteActorReview_actorReviewId_fkey" FOREIGN KEY ("actorReviewId") REFERENCES "ActorReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownvoteActorReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "actorReviewId" INTEGER NOT NULL,
    CONSTRAINT "DownvoteActorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteActorReview_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteActorReview_actorReviewId_fkey" FOREIGN KEY ("actorReviewId") REFERENCES "ActorReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "userId" INTEGER NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ActivateToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activatedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ActivateToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResetPasswordToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resetPasswordAt" DATETIME,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ResetPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Crew" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullname" TEXT NOT NULL,
    "photoSrc" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "photoSrcProd" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "debut" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CrewReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT,
    "rating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    CONSTRAINT "CrewReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CrewReview_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UpvoteCrewReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    "crewReviewId" INTEGER NOT NULL,
    CONSTRAINT "UpvoteCrewReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteCrewReview_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteCrewReview_crewReviewId_fkey" FOREIGN KEY ("crewReviewId") REFERENCES "CrewReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownvoteCrewReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    "crewReviewId" INTEGER NOT NULL,
    CONSTRAINT "DownvoteCrewReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteCrewReview_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteCrewReview_crewReviewId_fkey" FOREIGN KEY ("crewReviewId") REFERENCES "CrewReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "photoSrc" TEXT NOT NULL,
    "photoSrcProd" TEXT NOT NULL,
    "trailerSrc" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "dateAired" DATETIME,
    "ratingImdb" REAL NOT NULL,
    "seasonId" INTEGER NOT NULL,
    CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EpisodeReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT,
    "rating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    CONSTRAINT "EpisodeReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EpisodeReview_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UpvoteEpisodeReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "episodeReviewId" INTEGER NOT NULL,
    CONSTRAINT "UpvoteEpisodeReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteEpisodeReview_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteEpisodeReview_episodeReviewId_fkey" FOREIGN KEY ("episodeReviewId") REFERENCES "EpisodeReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownvoteEpisodeReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "episodeReviewId" INTEGER NOT NULL,
    CONSTRAINT "DownvoteEpisodeReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteEpisodeReview_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteEpisodeReview_episodeReviewId_fkey" FOREIGN KEY ("episodeReviewId") REFERENCES "EpisodeReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForumCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,
    "topicCount" INTEGER NOT NULL DEFAULT 0,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "lastPostAt" DATETIME,
    "lastPostId" INTEGER,
    CONSTRAINT "ForumCategory_lastPostId_fkey" FOREIGN KEY ("lastPostId") REFERENCES "ForumPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserForumModerator" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "UserForumModerator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserForumModerator_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ForumCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForumPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editCount" INTEGER NOT NULL DEFAULT 0,
    "lastEditAt" DATETIME,
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

-- CreateTable
CREATE TABLE "Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attachment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UpvoteForumPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "UpvoteForumPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteForumPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownvoteForumPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "DownvoteForumPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteForumPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForumPostHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "editedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" INTEGER NOT NULL,
    "editedById" INTEGER NOT NULL,
    CONSTRAINT "ForumPostHistory_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ForumPostHistory_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForumReply" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editCount" INTEGER NOT NULL DEFAULT 0,
    "lastEditAt" DATETIME,
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ForumReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ForumReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UpvoteForumReply" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "replyId" INTEGER NOT NULL,
    CONSTRAINT "UpvoteForumReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteForumReply_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "ForumReply" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownvoteForumReply" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "replyId" INTEGER NOT NULL,
    CONSTRAINT "DownvoteForumReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteForumReply_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "ForumReply" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForumReplyHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "editedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "replyId" INTEGER NOT NULL,
    "editedById" INTEGER NOT NULL,
    CONSTRAINT "ForumReplyHistory_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "ForumReply" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ForumReplyHistory_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForumTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ForumTopic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastPostAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "closedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "closedById" INTEGER,
    "categoryId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ForumTopic_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ForumTopic_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ForumCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ForumTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserForumTopicWatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    CONSTRAINT "UserForumTopicWatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserForumTopicWatch_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserForumTopicFavorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    CONSTRAINT "UserForumTopicFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserForumTopicFavorite_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UpvoteForumTopic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    CONSTRAINT "UpvoteForumTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteForumTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownvoteForumTopic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    CONSTRAINT "DownvoteForumTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteForumTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "List" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentType" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "lastViewedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListShare" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "sharedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListShare_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListMovie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "listId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListMovie_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListSerie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "listId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListSerie_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListSerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListSerie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListSeason" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "listId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListSeason_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListSeason_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListSeason_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListEpisode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "listId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListEpisode_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListEpisode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListActor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "listId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListActor_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActor_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListCrew" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "listId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListCrew_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListCrew_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListCrew_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListActivityMovie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actionType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListActivityMovie_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActivityMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActivityMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListActivitySerie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actionType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListActivitySerie_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActivitySerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActivitySerie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListActivitySeason" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actionType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListActivitySeason_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActivitySeason_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActivitySeason_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListActivityEpisode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actionType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListActivityEpisode_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActivityEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActivityEpisode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListActivityActor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actionType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListActivityActor_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActivityActor_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActivityActor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListActivityCrew" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actionType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ListActivityCrew_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActivityCrew_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListActivityCrew_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inbox" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" DATETIME,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "inboxId" INTEGER NOT NULL,
    CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "Inbox" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserInbox" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "inboxId" INTEGER NOT NULL,
    CONSTRAINT "UserInbox_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserInbox_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "Inbox" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReportedContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportType" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "resolutionDetails" TEXT,
    "contentId" INTEGER NOT NULL,
    "reportingUserId" INTEGER NOT NULL,
    "reportedUserId" INTEGER,
    CONSTRAINT "ReportedContent_reportingUserId_fkey" FOREIGN KEY ("reportingUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReportedContent_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModerationLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actionType" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,
    "moderatorUserId" INTEGER NOT NULL,
    "targetUserId" INTEGER,
    "targetContentId" INTEGER,
    CONSTRAINT "ModerationLog_moderatorUserId_fkey" FOREIGN KEY ("moderatorUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ModerationLog_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "photoSrc" TEXT NOT NULL,
    "photoSrcProd" TEXT NOT NULL,
    "trailerSrc" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "ratingImdb" REAL NOT NULL,
    "dateAired" DATETIME,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MovieReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT,
    "rating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    CONSTRAINT "MovieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MovieReview_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UpvoteMovieReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "movieReviewId" INTEGER NOT NULL,
    CONSTRAINT "UpvoteMovieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteMovieReview_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteMovieReview_movieReviewId_fkey" FOREIGN KEY ("movieReviewId") REFERENCES "MovieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownvoteMovieReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "movieReviewId" INTEGER NOT NULL,
    CONSTRAINT "DownvoteMovieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteMovieReview_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteMovieReview_movieReviewId_fkey" FOREIGN KEY ("movieReviewId") REFERENCES "MovieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CastMovie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movieId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    CONSTRAINT "CastMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CastMovie_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CrewMovie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movieId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    CONSTRAINT "CrewMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CrewMovie_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MovieGenre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movieId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    CONSTRAINT "MovieGenre_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MovieGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "photoSrc" TEXT NOT NULL,
    "photoSrcProd" TEXT NOT NULL,
    "trailerSrc" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateAired" DATETIME,
    "ratingImdb" REAL NOT NULL,
    "serieId" INTEGER NOT NULL,
    CONSTRAINT "Season_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SeasonReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT,
    "rating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    CONSTRAINT "SeasonReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SeasonReview_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UpvoteSeasonReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "seasonReviewId" INTEGER NOT NULL,
    CONSTRAINT "UpvoteSeasonReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteSeasonReview_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteSeasonReview_seasonReviewId_fkey" FOREIGN KEY ("seasonReviewId") REFERENCES "SeasonReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownvoteSeasonReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "seasonReviewId" INTEGER NOT NULL,
    CONSTRAINT "DownvoteSeasonReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteSeasonReview_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteSeasonReview_seasonReviewId_fkey" FOREIGN KEY ("seasonReviewId") REFERENCES "SeasonReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Serie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "photoSrc" TEXT NOT NULL,
    "photoSrcProd" TEXT NOT NULL,
    "trailerSrc" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateAired" DATETIME,
    "ratingImdb" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "UpvoteSerieReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    "serieReviewId" INTEGER NOT NULL,
    CONSTRAINT "UpvoteSerieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteSerieReview_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteSerieReview_serieReviewId_fkey" FOREIGN KEY ("serieReviewId") REFERENCES "SerieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownvoteSerieReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    "serieReviewId" INTEGER NOT NULL,
    CONSTRAINT "DownvoteSerieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteSerieReview_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteSerieReview_serieReviewId_fkey" FOREIGN KEY ("serieReviewId") REFERENCES "SerieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SerieReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT,
    "rating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    CONSTRAINT "SerieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SerieReview_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SerieGenre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serieId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    CONSTRAINT "SerieGenre_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SerieGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CastSerie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serieId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    CONSTRAINT "CastSerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CastSerie_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CrewSerie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serieId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    CONSTRAINT "CrewSerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CrewSerie_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'User',
    "bio" TEXT,
    "age" INTEGER,
    "birthday" DATETIME,
    "gender" TEXT NOT NULL DEFAULT 'Male',
    "phone" TEXT NOT NULL DEFAULT '+11234567890',
    "countryFrom" TEXT NOT NULL DEFAULT 'United States',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "canResetPassword" BOOLEAN NOT NULL DEFAULT false,
    "subscribed" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "photoSrc" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Avatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserFollow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state" TEXT NOT NULL DEFAULT 'pending',
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,
    CONSTRAINT "UserFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForumUserStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "topicCount" INTEGER NOT NULL DEFAULT 0,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "upvotesReceived" INTEGER NOT NULL DEFAULT 0,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "lastPostAt" DATETIME,
    CONSTRAINT "ForumUserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserListStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "totalLists" INTEGER NOT NULL DEFAULT 0,
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "sharedLists" INTEGER NOT NULL DEFAULT 0,
    "lastListAt" DATETIME,
    CONSTRAINT "UserListStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserMovieFavorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    CONSTRAINT "UserMovieFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserMovieFavorite_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserGenreFavorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    CONSTRAINT "UserGenreFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserGenreFavorite_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSerieFavorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    CONSTRAINT "UserSerieFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserSerieFavorite_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserEpisodeFavorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    CONSTRAINT "UserEpisodeFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserEpisodeFavorite_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSeasonFavorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    CONSTRAINT "UserSeasonFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserSeasonFavorite_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserActorFavorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    CONSTRAINT "UserActorFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserActorFavorite_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserCrewFavorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    CONSTRAINT "UserCrewFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserCrewFavorite_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserMovieRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rating" REAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    CONSTRAINT "UserMovieRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserMovieRating_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSerieRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rating" REAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    CONSTRAINT "UserSerieRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserSerieRating_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSeasonRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rating" REAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    CONSTRAINT "UserSeasonRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserSeasonRating_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserEpisodeRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rating" REAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    CONSTRAINT "UserEpisodeRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserEpisodeRating_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserActorRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rating" REAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    CONSTRAINT "UserActorRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserActorRating_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserCrewRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rating" REAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    CONSTRAINT "UserCrewRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserCrewRating_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ForumTagToForumTopic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ForumTagToForumTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "ForumTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ForumTagToForumTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "ForumTopic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Actor_fullname_idx" ON "Actor"("fullname" ASC);

-- CreateIndex
CREATE INDEX "Actor_debut_idx" ON "Actor"("debut");

-- CreateIndex
CREATE UNIQUE INDEX "ActorReview_userId_actorId_key" ON "ActorReview"("userId", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteActorReview_userId_actorId_actorReviewId_key" ON "UpvoteActorReview"("userId", "actorId", "actorReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteActorReview_userId_actorId_actorReviewId_key" ON "DownvoteActorReview"("userId", "actorId", "actorReviewId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "ActivateToken_token_key" ON "ActivateToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordToken_token_key" ON "ResetPasswordToken"("token");

-- CreateIndex
CREATE INDEX "Crew_fullname_idx" ON "Crew"("fullname" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CrewReview_userId_crewId_key" ON "CrewReview"("userId", "crewId");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteCrewReview_userId_crewId_crewReviewId_key" ON "UpvoteCrewReview"("userId", "crewId", "crewReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteCrewReview_userId_crewId_crewReviewId_key" ON "DownvoteCrewReview"("userId", "crewId", "crewReviewId");

-- CreateIndex
CREATE INDEX "Episode_title_idx" ON "Episode"("title" ASC);

-- CreateIndex
CREATE INDEX "Episode_duration_idx" ON "Episode"("duration");

-- CreateIndex
CREATE INDEX "Episode_ratingImdb_idx" ON "Episode"("ratingImdb");

-- CreateIndex
CREATE INDEX "Episode_dateAired_idx" ON "Episode"("dateAired");

-- CreateIndex
CREATE UNIQUE INDEX "EpisodeReview_userId_episodeId_key" ON "EpisodeReview"("userId", "episodeId");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteEpisodeReview_userId_episodeId_episodeReviewId_key" ON "UpvoteEpisodeReview"("userId", "episodeId", "episodeReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteEpisodeReview_userId_episodeId_episodeReviewId_key" ON "DownvoteEpisodeReview"("userId", "episodeId", "episodeReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "ForumCategory_slug_key" ON "ForumCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ForumCategory_lastPostId_key" ON "ForumCategory"("lastPostId");

-- CreateIndex
CREATE INDEX "ForumCategory_name_idx" ON "ForumCategory"("name" ASC);

-- CreateIndex
CREATE INDEX "ForumCategory_order_idx" ON "ForumCategory"("order");

-- CreateIndex
CREATE INDEX "ForumCategory_lastPostId_idx" ON "ForumCategory"("lastPostId");

-- CreateIndex
CREATE INDEX "ForumCategory_isActive_order_idx" ON "ForumCategory"("isActive", "order");

-- CreateIndex
CREATE UNIQUE INDEX "UserForumModerator_userId_categoryId_key" ON "UserForumModerator"("userId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ForumPost_slug_key" ON "ForumPost"("slug");

-- CreateIndex
CREATE INDEX "ForumPost_createdAt_idx" ON "ForumPost"("createdAt");

-- CreateIndex
CREATE INDEX "ForumPost_isModerated_idx" ON "ForumPost"("isModerated");

-- CreateIndex
CREATE INDEX "ForumPost_topicId_idx" ON "ForumPost"("topicId");

-- CreateIndex
CREATE INDEX "ForumPost_isDeleted_idx" ON "ForumPost"("isDeleted");

-- CreateIndex
CREATE INDEX "ForumPost_answeredAt_idx" ON "ForumPost"("answeredAt");

-- CreateIndex
CREATE INDEX "Attachment_uploadedAt_idx" ON "Attachment"("uploadedAt");

-- CreateIndex
CREATE INDEX "Attachment_mimeType_idx" ON "Attachment"("mimeType");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteForumPost_userId_postId_key" ON "UpvoteForumPost"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteForumPost_userId_postId_key" ON "DownvoteForumPost"("userId", "postId");

-- CreateIndex
CREATE INDEX "ForumReply_createdAt_idx" ON "ForumReply"("createdAt");

-- CreateIndex
CREATE INDEX "ForumReply_isModerated_idx" ON "ForumReply"("isModerated");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteForumReply_userId_replyId_key" ON "UpvoteForumReply"("userId", "replyId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteForumReply_userId_replyId_key" ON "DownvoteForumReply"("userId", "replyId");

-- CreateIndex
CREATE INDEX "ForumReplyHistory_editedAt_idx" ON "ForumReplyHistory"("editedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ForumTag_name_key" ON "ForumTag"("name");

-- CreateIndex
CREATE INDEX "ForumTag_name_idx" ON "ForumTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ForumTopic_slug_key" ON "ForumTopic"("slug");

-- CreateIndex
CREATE INDEX "ForumTopic_title_idx" ON "ForumTopic"("title" ASC);

-- CreateIndex
CREATE INDEX "ForumTopic_createdAt_idx" ON "ForumTopic"("createdAt");

-- CreateIndex
CREATE INDEX "ForumTopic_lastPostAt_idx" ON "ForumTopic"("lastPostAt");

-- CreateIndex
CREATE INDEX "ForumTopic_isPinned_idx" ON "ForumTopic"("isPinned");

-- CreateIndex
CREATE UNIQUE INDEX "UserForumTopicWatch_userId_topicId_key" ON "UserForumTopicWatch"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "UserForumTopicFavorite_userId_topicId_key" ON "UserForumTopicFavorite"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteForumTopic_userId_topicId_key" ON "UpvoteForumTopic"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteForumTopic_userId_topicId_key" ON "DownvoteForumTopic"("userId", "topicId");

-- CreateIndex
CREATE INDEX "Genre_name_idx" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "List_userId_idx" ON "List"("userId");

-- CreateIndex
CREATE INDEX "List_createdAt_idx" ON "List"("createdAt");

-- CreateIndex
CREATE INDEX "List_isDefault_idx" ON "List"("isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "ListShare_listId_userId_key" ON "ListShare"("listId", "userId");

-- CreateIndex
CREATE INDEX "ListMovie_listId_orderIndex_idx" ON "ListMovie"("listId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListMovie_listId_movieId_key" ON "ListMovie"("listId", "movieId");

-- CreateIndex
CREATE INDEX "ListSerie_listId_orderIndex_idx" ON "ListSerie"("listId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListSerie_listId_serieId_key" ON "ListSerie"("listId", "serieId");

-- CreateIndex
CREATE INDEX "ListSeason_listId_orderIndex_idx" ON "ListSeason"("listId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListSeason_listId_seasonId_key" ON "ListSeason"("listId", "seasonId");

-- CreateIndex
CREATE INDEX "ListEpisode_listId_orderIndex_idx" ON "ListEpisode"("listId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListEpisode_listId_episodeId_key" ON "ListEpisode"("listId", "episodeId");

-- CreateIndex
CREATE INDEX "ListActor_listId_orderIndex_idx" ON "ListActor"("listId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListActor_listId_actorId_key" ON "ListActor"("listId", "actorId");

-- CreateIndex
CREATE INDEX "ListCrew_listId_orderIndex_idx" ON "ListCrew"("listId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListCrew_listId_crewId_key" ON "ListCrew"("listId", "crewId");

-- CreateIndex
CREATE INDEX "ListActivityMovie_listId_createdAt_idx" ON "ListActivityMovie"("listId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityMovie_userId_createdAt_idx" ON "ListActivityMovie"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivitySerie_listId_createdAt_idx" ON "ListActivitySerie"("listId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivitySerie_userId_createdAt_idx" ON "ListActivitySerie"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivitySeason_listId_createdAt_idx" ON "ListActivitySeason"("listId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivitySeason_userId_createdAt_idx" ON "ListActivitySeason"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityEpisode_listId_createdAt_idx" ON "ListActivityEpisode"("listId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityEpisode_userId_createdAt_idx" ON "ListActivityEpisode"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityActor_listId_createdAt_idx" ON "ListActivityActor"("listId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityActor_userId_createdAt_idx" ON "ListActivityActor"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityCrew_listId_createdAt_idx" ON "ListActivityCrew"("listId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityCrew_userId_createdAt_idx" ON "ListActivityCrew"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserInbox_userId_inboxId_key" ON "UserInbox"("userId", "inboxId");

-- CreateIndex
CREATE INDEX "ReportedContent_contentId_idx" ON "ReportedContent"("contentId");

-- CreateIndex
CREATE INDEX "ModerationLog_targetUserId_idx" ON "ModerationLog"("targetUserId");

-- CreateIndex
CREATE INDEX "ModerationLog_targetContentId_idx" ON "ModerationLog"("targetContentId");

-- CreateIndex
CREATE INDEX "Movie_title_idx" ON "Movie"("title" ASC);

-- CreateIndex
CREATE INDEX "Movie_duration_idx" ON "Movie"("duration");

-- CreateIndex
CREATE INDEX "Movie_ratingImdb_idx" ON "Movie"("ratingImdb");

-- CreateIndex
CREATE INDEX "Movie_dateAired_idx" ON "Movie"("dateAired");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteMovieReview_userId_movieId_movieReviewId_key" ON "UpvoteMovieReview"("userId", "movieId", "movieReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteMovieReview_userId_movieId_movieReviewId_key" ON "DownvoteMovieReview"("userId", "movieId", "movieReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "CastMovie_movieId_actorId_key" ON "CastMovie"("movieId", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "CrewMovie_crewId_movieId_key" ON "CrewMovie"("crewId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieGenre_genreId_movieId_key" ON "MovieGenre"("genreId", "movieId");

-- CreateIndex
CREATE INDEX "Season_title_idx" ON "Season"("title" ASC);

-- CreateIndex
CREATE INDEX "Season_ratingImdb_idx" ON "Season"("ratingImdb");

-- CreateIndex
CREATE INDEX "Season_dateAired_idx" ON "Season"("dateAired");

-- CreateIndex
CREATE UNIQUE INDEX "SeasonReview_userId_seasonId_key" ON "SeasonReview"("userId", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteSeasonReview_userId_seasonId_seasonReviewId_key" ON "UpvoteSeasonReview"("userId", "seasonId", "seasonReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteSeasonReview_userId_seasonId_seasonReviewId_key" ON "DownvoteSeasonReview"("userId", "seasonId", "seasonReviewId");

-- CreateIndex
CREATE INDEX "Serie_title_idx" ON "Serie"("title" ASC);

-- CreateIndex
CREATE INDEX "Serie_dateAired_idx" ON "Serie"("dateAired");

-- CreateIndex
CREATE INDEX "Serie_ratingImdb_idx" ON "Serie"("ratingImdb");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteSerieReview_userId_serieId_serieReviewId_key" ON "UpvoteSerieReview"("userId", "serieId", "serieReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteSerieReview_userId_serieId_serieReviewId_key" ON "DownvoteSerieReview"("userId", "serieId", "serieReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "SerieReview_userId_serieId_key" ON "SerieReview"("userId", "serieId");

-- CreateIndex
CREATE UNIQUE INDEX "SerieGenre_serieId_genreId_key" ON "SerieGenre"("serieId", "genreId");

-- CreateIndex
CREATE UNIQUE INDEX "CastSerie_serieId_actorId_key" ON "CastSerie"("serieId", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "CrewSerie_serieId_crewId_key" ON "CrewSerie"("serieId", "crewId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_userName_idx" ON "User"("userName" ASC);

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_countryFrom_idx" ON "User"("countryFrom");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_userId_key" ON "Avatar"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFollow_followerId_followingId_key" ON "UserFollow"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "ForumUserStats_userId_key" ON "ForumUserStats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserListStats_userId_key" ON "UserListStats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMovieFavorite_userId_movieId_key" ON "UserMovieFavorite"("userId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGenreFavorite_userId_genreId_key" ON "UserGenreFavorite"("userId", "genreId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSerieFavorite_userId_serieId_key" ON "UserSerieFavorite"("userId", "serieId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEpisodeFavorite_userId_episodeId_key" ON "UserEpisodeFavorite"("userId", "episodeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSeasonFavorite_userId_seasonId_key" ON "UserSeasonFavorite"("userId", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "UserActorFavorite_userId_actorId_key" ON "UserActorFavorite"("userId", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCrewFavorite_userId_crewId_key" ON "UserCrewFavorite"("userId", "crewId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMovieRating_userId_movieId_key" ON "UserMovieRating"("userId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSerieRating_userId_serieId_key" ON "UserSerieRating"("userId", "serieId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSeasonRating_userId_seasonId_key" ON "UserSeasonRating"("userId", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEpisodeRating_userId_episodeId_key" ON "UserEpisodeRating"("userId", "episodeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserActorRating_userId_actorId_key" ON "UserActorRating"("userId", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCrewRating_userId_crewId_key" ON "UserCrewRating"("userId", "crewId");

-- CreateIndex
CREATE UNIQUE INDEX "_ForumTagToForumTopic_AB_unique" ON "_ForumTagToForumTopic"("A", "B");

-- CreateIndex
CREATE INDEX "_ForumTagToForumTopic_B_index" ON "_ForumTagToForumTopic"("B");
