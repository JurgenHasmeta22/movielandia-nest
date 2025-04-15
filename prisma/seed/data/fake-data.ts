import { PostType, TopicStatus, ListActionType, ContentType, ModerationAction, ReportType, ReportStatus, NotificationStatus, NotificationType, UserType, FollowState, Gender } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';

export function fakeActor() {
  return {
    fullname: faker.lorem.words(5),
    photoSrc: faker.lorem.words(5),
    photoSrcProd: faker.lorem.words(5),
    description: faker.lorem.words(5),
    debut: faker.lorem.words(5),
  };
}
export function fakeActorComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    fullname: faker.lorem.words(5),
    photoSrc: faker.lorem.words(5),
    photoSrcProd: faker.lorem.words(5),
    description: faker.lorem.words(5),
    debut: faker.lorem.words(5),
  };
}
export function fakeActorReview() {
  return {
    content: undefined,
    rating: undefined,
    updatedAt: undefined,
  };
}
export function fakeActorReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    content: undefined,
    rating: undefined,
    createdAt: new Date(),
    updatedAt: undefined,
    userId: faker.number.int(),
    actorId: faker.number.int(),
  };
}
export function fakeUpvoteActorReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    actorId: faker.number.int(),
    actorReviewId: faker.number.int(),
  };
}
export function fakeDownvoteActorReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    actorId: faker.number.int(),
    actorReviewId: faker.number.int(),
  };
}
export function fakeAccount() {
  return {
    type: faker.lorem.words(5),
    provider: faker.lorem.words(5),
    refresh_token: undefined,
    access_token: undefined,
    expires_at: undefined,
    token_type: undefined,
    scope: undefined,
    id_token: undefined,
    session_state: undefined,
    providerAccountId: faker.lorem.words(5),
  };
}
export function fakeAccountComplete() {
  return {
    id: faker.string.uuid(),
    type: faker.lorem.words(5),
    provider: faker.lorem.words(5),
    refresh_token: undefined,
    access_token: undefined,
    expires_at: undefined,
    token_type: undefined,
    scope: undefined,
    id_token: undefined,
    session_state: undefined,
    userId: faker.number.int(),
    providerAccountId: faker.lorem.words(5),
  };
}
export function fakeSession() {
  return {
    sessionToken: faker.lorem.words(5),
    expires: faker.date.anytime(),
  };
}
export function fakeSessionComplete() {
  return {
    id: faker.string.uuid(),
    sessionToken: faker.lorem.words(5),
    expires: faker.date.anytime(),
    userId: faker.number.int(),
  };
}
export function fakeVerificationToken() {
  return {
    identifier: faker.lorem.words(5),
    token: faker.lorem.words(5),
    expires: faker.date.anytime(),
  };
}
export function fakeVerificationTokenComplete() {
  return {
    identifier: faker.lorem.words(5),
    token: faker.lorem.words(5),
    expires: faker.date.anytime(),
  };
}
export function fakeActivateToken() {
  return {
    token: faker.lorem.words(5),
    activatedAt: undefined,
  };
}
export function fakeActivateTokenComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    token: faker.lorem.words(5),
    createdAt: new Date(),
    activatedAt: undefined,
    userId: faker.number.int(),
  };
}
export function fakeResetPasswordToken() {
  return {
    token: faker.lorem.words(5),
    resetPasswordAt: undefined,
  };
}
export function fakeResetPasswordTokenComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    token: faker.lorem.words(5),
    createdAt: new Date(),
    resetPasswordAt: undefined,
    userId: faker.number.int(),
  };
}
export function fakeCrew() {
  return {
    fullname: faker.lorem.words(5),
    photoSrc: faker.lorem.words(5),
    role: faker.lorem.words(5),
    photoSrcProd: faker.lorem.words(5),
    description: faker.lorem.words(5),
    debut: faker.lorem.words(5),
  };
}
export function fakeCrewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    fullname: faker.lorem.words(5),
    photoSrc: faker.lorem.words(5),
    role: faker.lorem.words(5),
    photoSrcProd: faker.lorem.words(5),
    description: faker.lorem.words(5),
    debut: faker.lorem.words(5),
  };
}
export function fakeCrewReview() {
  return {
    content: undefined,
    rating: undefined,
    updatedAt: undefined,
  };
}
export function fakeCrewReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    content: undefined,
    rating: undefined,
    createdAt: new Date(),
    updatedAt: undefined,
    userId: faker.number.int(),
    crewId: faker.number.int(),
  };
}
export function fakeUpvoteCrewReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    crewId: faker.number.int(),
    crewReviewId: faker.number.int(),
  };
}
export function fakeDownvoteCrewReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    crewId: faker.number.int(),
    crewReviewId: faker.number.int(),
  };
}
export function fakeEpisode() {
  return {
    title: faker.lorem.words(5),
    photoSrc: faker.lorem.words(5),
    photoSrcProd: faker.lorem.words(5),
    trailerSrc: faker.lorem.words(5),
    description: faker.lorem.words(5),
    duration: faker.number.int(),
    dateAired: undefined,
    ratingImdb: faker.number.float(),
  };
}
export function fakeEpisodeComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    title: faker.lorem.words(5),
    photoSrc: faker.lorem.words(5),
    photoSrcProd: faker.lorem.words(5),
    trailerSrc: faker.lorem.words(5),
    description: faker.lorem.words(5),
    duration: faker.number.int(),
    dateAired: undefined,
    ratingImdb: faker.number.float(),
    seasonId: faker.number.int(),
  };
}
export function fakeEpisodeReview() {
  return {
    content: undefined,
    rating: undefined,
    updatedAt: undefined,
  };
}
export function fakeEpisodeReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    content: undefined,
    rating: undefined,
    createdAt: new Date(),
    updatedAt: undefined,
    userId: faker.number.int(),
    episodeId: faker.number.int(),
  };
}
export function fakeUpvoteEpisodeReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    episodeId: faker.number.int(),
    episodeReviewId: faker.number.int(),
  };
}
export function fakeDownvoteEpisodeReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    episodeId: faker.number.int(),
    episodeReviewId: faker.number.int(),
  };
}
export function fakeForumCategory() {
  return {
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
    slug: faker.lorem.words(5),
    lastPostAt: undefined,
  };
}
export function fakeForumCategoryComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
    order: 0,
    isActive: true,
    slug: faker.lorem.words(5),
    topicCount: 0,
    postCount: 0,
    lastPostAt: undefined,
    lastPostId: undefined,
  };
}
export function fakeUserForumModeratorComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    createdAt: new Date(),
    userId: faker.number.int(),
    categoryId: faker.number.int(),
  };
}
export function fakeForumPost() {
  return {
    content: faker.lorem.words(5),
    updatedAt: undefined,
    lastEditAt: undefined,
    slug: faker.lorem.words(5),
    answeredAt: undefined,
    deletedAt: undefined,
  };
}
export function fakeForumPostComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    content: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: undefined,
    isEdited: false,
    editCount: 0,
    lastEditAt: undefined,
    isModerated: false,
    slug: faker.lorem.words(5),
    type: PostType.Normal,
    isAnswer: false,
    isDeleted: false,
    answeredAt: undefined,
    deletedAt: undefined,
    topicId: faker.number.int(),
    userId: faker.number.int(),
    answeredById: undefined,
    deletedById: undefined,
  };
}
export function fakeAttachment() {
  return {
    filename: faker.lorem.words(5),
    fileUrl: faker.lorem.words(5),
    fileSize: faker.number.int(),
    mimeType: faker.lorem.words(5),
    description: undefined,
  };
}
export function fakeAttachmentComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    filename: faker.lorem.words(5),
    fileUrl: faker.lorem.words(5),
    fileSize: faker.number.int(),
    mimeType: faker.lorem.words(5),
    uploadedAt: new Date(),
    isPublic: true,
    description: undefined,
    postId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeUpvoteForumPostComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    postId: faker.number.int(),
  };
}
export function fakeDownvoteForumPostComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    postId: faker.number.int(),
  };
}
export function fakeForumPostHistory() {
  return {
    content: faker.lorem.words(5),
  };
}
export function fakeForumPostHistoryComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    content: faker.lorem.words(5),
    editedAt: new Date(),
    postId: faker.number.int(),
    editedById: faker.number.int(),
  };
}
export function fakeForumReply() {
  return {
    content: faker.lorem.words(5),
    updatedAt: undefined,
    lastEditAt: undefined,
  };
}
export function fakeForumReplyComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    content: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: undefined,
    isEdited: false,
    editCount: 0,
    lastEditAt: undefined,
    isModerated: false,
    postId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeUpvoteForumReplyComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    replyId: faker.number.int(),
  };
}
export function fakeDownvoteForumReplyComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    replyId: faker.number.int(),
  };
}
export function fakeForumReplyHistory() {
  return {
    content: faker.lorem.words(5),
  };
}
export function fakeForumReplyHistoryComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    content: faker.lorem.words(5),
    editedAt: new Date(),
    replyId: faker.number.int(),
    editedById: faker.number.int(),
  };
}
export function fakeForumTag() {
  return {
    name: faker.person.fullName(),
    description: undefined,
    color: undefined,
  };
}
export function fakeForumTagComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    name: faker.person.fullName(),
    description: undefined,
    color: undefined,
    createdAt: new Date(),
  };
}
export function fakeForumTopic() {
  return {
    title: faker.lorem.words(5),
    content: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
    slug: faker.lorem.words(5),
    closedAt: undefined,
  };
}
export function fakeForumTopicComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    title: faker.lorem.words(5),
    content: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
    isPinned: false,
    isLocked: false,
    slug: faker.lorem.words(5),
    viewCount: 0,
    lastPostAt: new Date(),
    isModerated: false,
    closedAt: undefined,
    status: TopicStatus.Open,
    closedById: undefined,
    categoryId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeUserForumTopicWatchComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    createdAt: new Date(),
    userId: faker.number.int(),
    topicId: faker.number.int(),
  };
}
export function fakeUserForumTopicFavoriteComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    topicId: faker.number.int(),
  };
}
export function fakeUpvoteForumTopicComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    topicId: faker.number.int(),
  };
}
export function fakeDownvoteForumTopicComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    topicId: faker.number.int(),
  };
}
export function fakeGenre() {
  return {
    name: faker.person.fullName(),
  };
}
export function fakeGenreComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    name: faker.person.fullName(),
  };
}
export function fakeList() {
  return {
    name: faker.person.fullName(),
    description: undefined,
    contentType: undefined,
    updatedAt: faker.date.anytime(),
    lastViewedAt: undefined,
  };
}
export function fakeListComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    name: faker.person.fullName(),
    description: undefined,
    isPrivate: false,
    isArchived: false,
    isDefault: false,
    createdAt: new Date(),
    contentType: undefined,
    updatedAt: faker.date.anytime(),
    lastViewedAt: undefined,
    userId: faker.number.int(),
  };
}
export function fakeListShareComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    canEdit: false,
    sharedAt: new Date(),
    listId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeListMovie() {
  return {
    note: undefined,
  };
}
export function fakeListMovieComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    addedAt: new Date(),
    note: undefined,
    orderIndex: 0,
    listId: faker.number.int(),
    movieId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeListSerie() {
  return {
    note: undefined,
  };
}
export function fakeListSerieComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    addedAt: new Date(),
    note: undefined,
    orderIndex: 0,
    listId: faker.number.int(),
    serieId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeListSeason() {
  return {
    note: undefined,
  };
}
export function fakeListSeasonComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    addedAt: new Date(),
    note: undefined,
    orderIndex: 0,
    listId: faker.number.int(),
    seasonId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeListEpisode() {
  return {
    note: undefined,
  };
}
export function fakeListEpisodeComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    addedAt: new Date(),
    note: undefined,
    orderIndex: 0,
    listId: faker.number.int(),
    episodeId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeListActor() {
  return {
    note: undefined,
  };
}
export function fakeListActorComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    addedAt: new Date(),
    note: undefined,
    orderIndex: 0,
    listId: faker.number.int(),
    actorId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeListCrew() {
  return {
    note: undefined,
  };
}
export function fakeListCrewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    addedAt: new Date(),
    note: undefined,
    orderIndex: 0,
    listId: faker.number.int(),
    crewId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeListActivityMovie() {
  return {
    actionType: faker.helpers.arrayElement([ListActionType.Created, ListActionType.Updated, ListActionType.Deleted, ListActionType.ItemAdded, ListActionType.ItemRemoved, ListActionType.Shared, ListActionType.Unshared] as const),
    metadata: undefined,
  };
}
export function fakeListActivityMovieComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    actionType: faker.helpers.arrayElement([ListActionType.Created, ListActionType.Updated, ListActionType.Deleted, ListActionType.ItemAdded, ListActionType.ItemRemoved, ListActionType.Shared, ListActionType.Unshared] as const),
    metadata: undefined,
    createdAt: new Date(),
    listId: faker.number.int(),
    movieId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeListActivitySerie() {
  return {
    actionType: faker.helpers.arrayElement([ListActionType.Created, ListActionType.Updated, ListActionType.Deleted, ListActionType.ItemAdded, ListActionType.ItemRemoved, ListActionType.Shared, ListActionType.Unshared] as const),
    metadata: undefined,
  };
}
export function fakeListActivitySerieComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    actionType: faker.helpers.arrayElement([ListActionType.Created, ListActionType.Updated, ListActionType.Deleted, ListActionType.ItemAdded, ListActionType.ItemRemoved, ListActionType.Shared, ListActionType.Unshared] as const),
    metadata: undefined,
    createdAt: new Date(),
    listId: faker.number.int(),
    serieId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeListActivitySeason() {
  return {
    actionType: faker.helpers.arrayElement([ListActionType.Created, ListActionType.Updated, ListActionType.Deleted, ListActionType.ItemAdded, ListActionType.ItemRemoved, ListActionType.Shared, ListActionType.Unshared] as const),
    metadata: undefined,
  };
}
export function fakeListActivitySeasonComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    actionType: faker.helpers.arrayElement([ListActionType.Created, ListActionType.Updated, ListActionType.Deleted, ListActionType.ItemAdded, ListActionType.ItemRemoved, ListActionType.Shared, ListActionType.Unshared] as const),
    metadata: undefined,
    createdAt: new Date(),
    listId: faker.number.int(),
    seasonId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeListActivityEpisode() {
  return {
    actionType: faker.helpers.arrayElement([ListActionType.Created, ListActionType.Updated, ListActionType.Deleted, ListActionType.ItemAdded, ListActionType.ItemRemoved, ListActionType.Shared, ListActionType.Unshared] as const),
    metadata: undefined,
  };
}
export function fakeListActivityEpisodeComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    actionType: faker.helpers.arrayElement([ListActionType.Created, ListActionType.Updated, ListActionType.Deleted, ListActionType.ItemAdded, ListActionType.ItemRemoved, ListActionType.Shared, ListActionType.Unshared] as const),
    metadata: undefined,
    createdAt: new Date(),
    listId: faker.number.int(),
    episodeId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeListActivityActor() {
  return {
    actionType: faker.helpers.arrayElement([ListActionType.Created, ListActionType.Updated, ListActionType.Deleted, ListActionType.ItemAdded, ListActionType.ItemRemoved, ListActionType.Shared, ListActionType.Unshared] as const),
    metadata: undefined,
  };
}
export function fakeListActivityActorComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    actionType: faker.helpers.arrayElement([ListActionType.Created, ListActionType.Updated, ListActionType.Deleted, ListActionType.ItemAdded, ListActionType.ItemRemoved, ListActionType.Shared, ListActionType.Unshared] as const),
    metadata: undefined,
    createdAt: new Date(),
    listId: faker.number.int(),
    actorId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeListActivityCrew() {
  return {
    actionType: faker.helpers.arrayElement([ListActionType.Created, ListActionType.Updated, ListActionType.Deleted, ListActionType.ItemAdded, ListActionType.ItemRemoved, ListActionType.Shared, ListActionType.Unshared] as const),
    metadata: undefined,
  };
}
export function fakeListActivityCrewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    actionType: faker.helpers.arrayElement([ListActionType.Created, ListActionType.Updated, ListActionType.Deleted, ListActionType.ItemAdded, ListActionType.ItemRemoved, ListActionType.Shared, ListActionType.Unshared] as const),
    metadata: undefined,
    createdAt: new Date(),
    listId: faker.number.int(),
    crewId: faker.number.int(),
    userId: faker.number.int(),
  };
}
export function fakeInboxComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
  };
}
export function fakeMessage() {
  return {
    text: faker.lorem.words(5),
    editedAt: undefined,
  };
}
export function fakeMessageComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    text: faker.lorem.words(5),
    createdAt: new Date(),
    read: false,
    editedAt: undefined,
    senderId: faker.number.int(),
    receiverId: faker.number.int(),
    inboxId: faker.number.int(),
  };
}
export function fakeUserInboxComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    inboxId: faker.number.int(),
  };
}
export function fakeReportedContent() {
  return {
    reportType: faker.helpers.arrayElement([ReportType.Review, ReportType.Comment, ReportType.User, ReportType.Message, ReportType.Other] as const),
    reason: undefined,
    resolutionDetails: undefined,
    contentId: faker.number.int(),
  };
}
export function fakeReportedContentComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    reportType: faker.helpers.arrayElement([ReportType.Review, ReportType.Comment, ReportType.User, ReportType.Message, ReportType.Other] as const),
    reason: undefined,
    createdAt: new Date(),
    status: ReportStatus.Pending,
    resolutionDetails: undefined,
    contentId: faker.number.int(),
    reportingUserId: faker.number.int(),
    reportedUserId: undefined,
  };
}
export function fakeModerationLog() {
  return {
    actionType: faker.helpers.arrayElement([ModerationAction.DeleteReview, ModerationAction.DeleteComment, ModerationAction.BanUser, ModerationAction.WarnUser] as const),
    details: undefined,
    targetContentId: undefined,
  };
}
export function fakeModerationLogComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    actionType: faker.helpers.arrayElement([ModerationAction.DeleteReview, ModerationAction.DeleteComment, ModerationAction.BanUser, ModerationAction.WarnUser] as const),
    timestamp: new Date(),
    details: undefined,
    moderatorUserId: faker.number.int(),
    targetUserId: undefined,
    targetContentId: undefined,
  };
}
export function fakeMovie() {
  return {
    title: faker.lorem.words(5),
    photoSrc: faker.lorem.words(5),
    photoSrcProd: faker.lorem.words(5),
    trailerSrc: faker.lorem.words(5),
    duration: faker.number.int(),
    ratingImdb: faker.number.float(),
    dateAired: undefined,
    description: faker.lorem.words(5),
  };
}
export function fakeMovieComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    title: faker.lorem.words(5),
    photoSrc: faker.lorem.words(5),
    photoSrcProd: faker.lorem.words(5),
    trailerSrc: faker.lorem.words(5),
    duration: faker.number.int(),
    ratingImdb: faker.number.float(),
    dateAired: undefined,
    description: faker.lorem.words(5),
  };
}
export function fakeMovieReview() {
  return {
    content: undefined,
    rating: undefined,
    updatedAt: undefined,
  };
}
export function fakeMovieReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    content: undefined,
    rating: undefined,
    createdAt: new Date(),
    updatedAt: undefined,
    userId: faker.number.int(),
    movieId: faker.number.int(),
  };
}
export function fakeUpvoteMovieReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    movieId: faker.number.int(),
    movieReviewId: faker.number.int(),
  };
}
export function fakeDownvoteMovieReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    movieId: faker.number.int(),
    movieReviewId: faker.number.int(),
  };
}
export function fakeCastMovieComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    movieId: faker.number.int(),
    actorId: faker.number.int(),
  };
}
export function fakeCrewMovieComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    movieId: faker.number.int(),
    crewId: faker.number.int(),
  };
}
export function fakeMovieGenreComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    movieId: faker.number.int(),
    genreId: faker.number.int(),
  };
}
export function fakeNotification() {
  return {
    type: faker.helpers.arrayElement([NotificationType.follow_request, NotificationType.message_received, NotificationType.liked_review, NotificationType.disliked_review] as const),
    content: faker.lorem.words(5),
  };
}
export function fakeNotificationComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    type: faker.helpers.arrayElement([NotificationType.follow_request, NotificationType.message_received, NotificationType.liked_review, NotificationType.disliked_review] as const),
    content: faker.lorem.words(5),
    status: NotificationStatus.unread,
    createdAt: new Date(),
    userId: faker.number.int(),
    senderId: faker.number.int(),
  };
}
export function fakeSeason() {
  return {
    title: faker.lorem.words(5),
    photoSrc: faker.lorem.words(5),
    photoSrcProd: faker.lorem.words(5),
    trailerSrc: faker.lorem.words(5),
    description: faker.lorem.words(5),
    dateAired: undefined,
    ratingImdb: faker.number.float(),
  };
}
export function fakeSeasonComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    title: faker.lorem.words(5),
    photoSrc: faker.lorem.words(5),
    photoSrcProd: faker.lorem.words(5),
    trailerSrc: faker.lorem.words(5),
    description: faker.lorem.words(5),
    dateAired: undefined,
    ratingImdb: faker.number.float(),
    serieId: faker.number.int(),
  };
}
export function fakeSeasonReview() {
  return {
    content: undefined,
    rating: undefined,
    updatedAt: undefined,
  };
}
export function fakeSeasonReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    content: undefined,
    rating: undefined,
    createdAt: new Date(),
    updatedAt: undefined,
    userId: faker.number.int(),
    seasonId: faker.number.int(),
  };
}
export function fakeUpvoteSeasonReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    seasonId: faker.number.int(),
    seasonReviewId: faker.number.int(),
  };
}
export function fakeDownvoteSeasonReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    seasonId: faker.number.int(),
    seasonReviewId: faker.number.int(),
  };
}
export function fakeSerie() {
  return {
    title: faker.lorem.words(5),
    photoSrc: faker.lorem.words(5),
    photoSrcProd: faker.lorem.words(5),
    trailerSrc: faker.lorem.words(5),
    description: faker.lorem.words(5),
    dateAired: undefined,
    ratingImdb: faker.number.float(),
  };
}
export function fakeSerieComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    title: faker.lorem.words(5),
    photoSrc: faker.lorem.words(5),
    photoSrcProd: faker.lorem.words(5),
    trailerSrc: faker.lorem.words(5),
    description: faker.lorem.words(5),
    dateAired: undefined,
    ratingImdb: faker.number.float(),
  };
}
export function fakeUpvoteSerieReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    serieId: faker.number.int(),
    serieReviewId: faker.number.int(),
  };
}
export function fakeDownvoteSerieReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    serieId: faker.number.int(),
    serieReviewId: faker.number.int(),
  };
}
export function fakeSerieReview() {
  return {
    content: undefined,
    rating: undefined,
    updatedAt: undefined,
  };
}
export function fakeSerieReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    content: undefined,
    rating: undefined,
    createdAt: new Date(),
    updatedAt: undefined,
    userId: faker.number.int(),
    serieId: faker.number.int(),
  };
}
export function fakeSerieGenreComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    serieId: faker.number.int(),
    genreId: faker.number.int(),
  };
}
export function fakeCastSerieComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    serieId: faker.number.int(),
    actorId: faker.number.int(),
  };
}
export function fakeCrewSerieComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    serieId: faker.number.int(),
    crewId: faker.number.int(),
  };
}
export function fakeUser() {
  return {
    userName: faker.lorem.words(5),
    email: faker.internet.email(),
    password: undefined,
    bio: undefined,
    age: undefined,
    birthday: undefined,
  };
}
export function fakeUserComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userName: faker.lorem.words(5),
    email: faker.internet.email(),
    password: undefined,
    role: UserType.User,
    bio: undefined,
    age: undefined,
    birthday: undefined,
    gender: Gender.Male,
    phone: '+11234567890',
    countryFrom: 'United States',
    active: false,
    canResetPassword: false,
    subscribed: false,
  };
}
export function fakeAvatar() {
  return {
    photoSrc: faker.lorem.words(5),
  };
}
export function fakeAvatarComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    photoSrc: faker.lorem.words(5),
    userId: faker.number.int(),
  };
}
export function fakeUserFollowComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    state: FollowState.pending,
    followerId: faker.number.int(),
    followingId: faker.number.int(),
  };
}
export function fakeForumUserStats() {
  return {
    lastPostAt: undefined,
  };
}
export function fakeForumUserStatsComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    topicCount: 0,
    postCount: 0,
    replyCount: 0,
    upvotesReceived: 0,
    reputation: 0,
    lastPostAt: undefined,
  };
}
export function fakeUserListStats() {
  return {
    lastListAt: undefined,
  };
}
export function fakeUserListStatsComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    totalLists: 0,
    totalItems: 0,
    sharedLists: 0,
    lastListAt: undefined,
  };
}
export function fakeUserMovieFavoriteComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    movieId: faker.number.int(),
  };
}
export function fakeUserGenreFavoriteComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    genreId: faker.number.int(),
  };
}
export function fakeUserSerieFavoriteComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    serieId: faker.number.int(),
  };
}
export function fakeUserEpisodeFavoriteComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    episodeId: faker.number.int(),
  };
}
export function fakeUserSeasonFavoriteComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    seasonId: faker.number.int(),
  };
}
export function fakeUserActorFavoriteComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    actorId: faker.number.int(),
  };
}
export function fakeUserCrewFavoriteComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    userId: faker.number.int(),
    crewId: faker.number.int(),
  };
}
export function fakeUserMovieRating() {
  return {
    rating: faker.number.float(),
  };
}
export function fakeUserMovieRatingComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    rating: faker.number.float(),
    userId: faker.number.int(),
    movieId: faker.number.int(),
  };
}
export function fakeUserSerieRating() {
  return {
    rating: faker.number.float(),
  };
}
export function fakeUserSerieRatingComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    rating: faker.number.float(),
    userId: faker.number.int(),
    serieId: faker.number.int(),
  };
}
export function fakeUserSeasonRating() {
  return {
    rating: faker.number.float(),
  };
}
export function fakeUserSeasonRatingComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    rating: faker.number.float(),
    userId: faker.number.int(),
    seasonId: faker.number.int(),
  };
}
export function fakeUserEpisodeRating() {
  return {
    rating: faker.number.float(),
  };
}
export function fakeUserEpisodeRatingComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    rating: faker.number.float(),
    userId: faker.number.int(),
    episodeId: faker.number.int(),
  };
}
export function fakeUserActorRating() {
  return {
    rating: faker.number.float(),
  };
}
export function fakeUserActorRatingComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    rating: faker.number.float(),
    userId: faker.number.int(),
    actorId: faker.number.int(),
  };
}
export function fakeUserCrewRating() {
  return {
    rating: faker.number.float(),
  };
}
export function fakeUserCrewRatingComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    rating: faker.number.float(),
    userId: faker.number.int(),
    crewId: faker.number.int(),
  };
}
