import { Injectable, BadRequestException, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import {
    UserQueryDto,
    UserResponseDto,
    UsersListResponseDto,
    FavoriteType,
    FavoritesListResponseDto,
    FollowListResponseDto,
    MessagesListResponseDto,
    UserProfileDto,
} from "./dtos/user.dto";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUsersWithFilters(query: UserQueryDto): Promise<UsersListResponseDto> {
        const { page = 1, perPage = 12, userName, sortBy = "userName", ascOrDesc = "asc" } = query;

        const skip = (page - 1) * perPage;

        const filters: any = {};
        if (userName) {
            filters.userName = { contains: userName };
        }

        if (query.filterValue && query.filterNameString && query.filterOperatorString) {
            if (query.filterOperatorString === "contains") {
                filters[query.filterNameString] = { contains: query.filterValue };
            } else {
                const operator =
                    query.filterOperatorString === ">" ? "gt" : query.filterOperatorString === "<" ? "lt" : "equals";
                filters[query.filterNameString] = { [operator]: query.filterValue };
            }
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where: filters,
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    bio: true,
                },
                orderBy: { [sortBy]: ascOrDesc },
                skip,
                take: perPage,
            }),
            this.prisma.user.count({ where: filters }),
        ]);

        return {
            users,
            total,
            page,
            perPage,
        };
    }

    async getUserById(userId: number): Promise<UserProfileDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                userName: true,
                email: true,
                bio: true,
                avatar: {
                    select: {
                        photoSrc: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const [followersCount, followingCount, reviewsCount] = await Promise.all([
            this.prisma.userFollow.count({
                where: { followingId: userId, state: "accepted" },
            }),
            this.prisma.userFollow.count({
                where: { followerId: userId, state: "accepted" },
            }),
            this.getReviewsCount(userId),
        ]);

        const favoritesCount = await this.getFavoritesCount(userId);

        return {
            ...user,
            avatar: user.avatar?.photoSrc,
            followersCount,
            followingCount,
            reviewsCount,
            favoritesCount,
        };
    }

    async addFavorite(userId: number, itemId: number, type: FavoriteType): Promise<void> {
        await this.validateItemExists(itemId, type);

        const favoriteExists = await this.checkFavoriteExists(userId, itemId, type);
        if (favoriteExists) {
            throw new ConflictException("Item already in favorites");
        }

        await this.createFavorite(userId, itemId, type);
    }

    async removeFavorite(userId: number, itemId: number, type: FavoriteType): Promise<void> {
        const favoriteExists = await this.checkFavoriteExists(userId, itemId, type);
        if (!favoriteExists) {
            throw new NotFoundException("Favorite not found");
        }

        await this.deleteFavorite(userId, itemId, type);
    }

    async getFavorites(
        userId: number,
        type: FavoriteType,
        page: number = 1,
        search: string = "",
    ): Promise<FavoritesListResponseDto> {
        const perPage = 10;
        const skip = (page - 1) * perPage;

        const favorites = await this.getFavoritesQuery(userId, type, skip, perPage, search);
        const total = await this.getFavoritesCount(userId, type, search);

        return {
            items: favorites,
            total,
            page,
            perPage,
        };
    }

    async follow(followerId: number, followingId: number): Promise<void> {
        if (followerId === followingId) {
            throw new BadRequestException("You cannot follow yourself");
        }

        const userExists = await this.prisma.user.findUnique({
            where: { id: followingId },
        });

        if (!userExists) {
            throw new NotFoundException("User to follow not found");
        }

        const existingFollow = await this.prisma.userFollow.findFirst({
            where: { followerId, followingId },
        });

        if (existingFollow) {
            throw new ConflictException("Follow request already exists");
        }

        await this.prisma.$transaction([
            this.prisma.userFollow.create({
                data: {
                    followerId,
                    followingId,
                    state: "pending",
                },
            }),
            this.prisma.notification.create({
                data: {
                    type: "follow_request",
                    content: "sent you a follow request",
                    userId: followingId,
                    senderId: followerId,
                    status: "unread",
                },
            }),
        ]);
    }

    async unfollow(followerId: number, followingId: number): Promise<void> {
        if (followerId === followingId) {
            throw new BadRequestException("You cannot unfollow yourself");
        }

        const follow = await this.prisma.userFollow.findFirst({
            where: { followerId, followingId },
        });

        if (!follow) {
            throw new NotFoundException("Follow relationship not found");
        }

        await this.prisma.userFollow.delete({
            where: { id: follow.id },
        });
    }

    async acceptFollowRequest(followerId: number, followingId: number): Promise<void> {
        const follow = await this.prisma.userFollow.findFirst({
            where: { followerId, followingId, state: "pending" },
        });

        if (!follow) {
            throw new NotFoundException("Follow request not found");
        }

        await this.prisma.userFollow.update({
            where: { id: follow.id },
            data: { state: "accepted" },
        });
    }

    async rejectFollowRequest(followerId: number, followingId: number): Promise<void> {
        const follow = await this.prisma.userFollow.findFirst({
            where: { followerId, followingId, state: "pending" },
        });

        if (!follow) {
            throw new NotFoundException("Follow request not found");
        }

        await this.prisma.userFollow.delete({
            where: { id: follow.id },
        });
    }

    async sendMessage(senderId: number, receiverId: number, text: string): Promise<any> {
        if (senderId === receiverId) {
            throw new BadRequestException("You cannot message yourself");
        }

        const receiver = await this.prisma.user.findUnique({
            where: { id: receiverId },
        });

        if (!receiver) {
            throw new NotFoundException("Receiver not found");
        }

        const inbox = await this.prisma.inbox.create({
            data: {
                participants: {
                    create: [{ userId: senderId }, { userId: receiverId }],
                },
            },
        });

        return this.prisma.message.create({
            data: {
                text,
                senderId,
                receiverId,
                inboxId: inbox.id,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });
    }

    async getInbox(userId: number, page: number = 1): Promise<MessagesListResponseDto> {
        const perPage = 10;
        const skip = (page - 1) * perPage;

        const [messages, total] = await Promise.all([
            this.prisma.message.findMany({
                where: { receiverId: userId },
                include: {
                    sender: {
                        select: {
                            id: true,
                            userName: true,
                            email: true,
                            bio: true,
                        },
                    },
                    receiver: {
                        select: {
                            id: true,
                            userName: true,
                            email: true,
                            bio: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: perPage,
            }),
            this.prisma.message.count({ where: { receiverId: userId } }),
        ]);

        return {
            items: messages.map((m) => ({
                id: m.id,
                text: m.text,
                sender: m.sender,
                receiver: m.receiver,
                createdAt: m.createdAt,
                isRead: m.read,
            })),
            total,
            page,
            perPage,
        };
    }

    async getSentMessages(userId: number, page: number = 1): Promise<MessagesListResponseDto> {
        const perPage = 10;
        const skip = (page - 1) * perPage;

        const [messages, total] = await Promise.all([
            this.prisma.message.findMany({
                where: { senderId: userId },
                include: {
                    sender: {
                        select: {
                            id: true,
                            userName: true,
                            email: true,
                            bio: true,
                        },
                    },
                    receiver: {
                        select: {
                            id: true,
                            userName: true,
                            email: true,
                            bio: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: perPage,
            }),
            this.prisma.message.count({ where: { senderId: userId } }),
        ]);

        return {
            items: messages.map((m) => ({
                id: m.id,
                text: m.text,
                sender: m.sender,
                receiver: m.receiver,
                createdAt: m.createdAt,
                isRead: m.read,
            })),
            total,
            page,
            perPage,
        };
    }

    async deleteMessage(messageId: number, userId: number): Promise<void> {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });

        if (!message) {
            throw new NotFoundException("Message not found");
        }

        if (message.senderId !== userId && message.receiverId !== userId) {
            throw new BadRequestException("You cannot delete this message");
        }

        await this.prisma.message.delete({
            where: { id: messageId },
        });
    }

    private async validateItemExists(itemId: number, type: FavoriteType): Promise<void> {
        let item;

        const favoriteType = type as FavoriteType;
        switch (favoriteType) {
            case FavoriteType.MOVIES:
                item = await this.prisma.movie.findUnique({ where: { id: itemId } });
                break;
            case FavoriteType.SERIES:
                item = await this.prisma.serie.findUnique({ where: { id: itemId } });
                break;
            case FavoriteType.ACTORS:
                item = await this.prisma.actor.findUnique({ where: { id: itemId } });
                break;
            case FavoriteType.CREW:
                item = await this.prisma.crew.findUnique({ where: { id: itemId } });
                break;
            case FavoriteType.SEASONS:
                item = await this.prisma.season.findUnique({ where: { id: itemId } });
                break;
            case FavoriteType.EPISODES:
                item = await this.prisma.episode.findUnique({ where: { id: itemId } });
                break;
        }

        if (!item) {
            throw new NotFoundException(`Item not found`);
        }
    }

    private convertReviewTypeToFavoriteType(itemType: string): FavoriteType {
        switch (itemType) {
            case "movie":
                return FavoriteType.MOVIES;
            case "serie":
                return FavoriteType.SERIES;
            case "season":
                return FavoriteType.SEASONS;
            case "episode":
                return FavoriteType.EPISODES;
            case "actor":
                return FavoriteType.ACTORS;
            case "crew":
                return FavoriteType.CREW;
            default:
                throw new BadRequestException(`Invalid item type: ${itemType}`);
        }
    }

    private async checkFavoriteExists(userId: number, itemId: number, type: FavoriteType): Promise<boolean> {
        switch (type) {
            case FavoriteType.MOVIES:
                return !!(await this.prisma.userMovieFavorite.findFirst({
                    where: { userId, movieId: itemId },
                }));
            case FavoriteType.SERIES:
                return !!(await this.prisma.userSerieFavorite.findFirst({
                    where: { userId, serieId: itemId },
                }));
            case FavoriteType.ACTORS:
                return !!(await this.prisma.userActorFavorite.findFirst({
                    where: { userId, actorId: itemId },
                }));
            case FavoriteType.CREW:
                return !!(await this.prisma.userCrewFavorite.findFirst({
                    where: { userId, crewId: itemId },
                }));
            case FavoriteType.SEASONS:
                return !!(await this.prisma.userSeasonFavorite.findFirst({
                    where: { userId, seasonId: itemId },
                }));
            case FavoriteType.EPISODES:
                return !!(await this.prisma.userEpisodeFavorite.findFirst({
                    where: { userId, episodeId: itemId },
                }));
        }
    }

    private async createFavorite(userId: number, itemId: number, type: FavoriteType): Promise<void> {
        switch (type) {
            case FavoriteType.MOVIES:
                await this.prisma.userMovieFavorite.create({
                    data: { userId, movieId: itemId },
                });
                break;
            case FavoriteType.SERIES:
                await this.prisma.userSerieFavorite.create({
                    data: { userId, serieId: itemId },
                });
                break;
            case FavoriteType.ACTORS:
                await this.prisma.userActorFavorite.create({
                    data: { userId, actorId: itemId },
                });
                break;
            case FavoriteType.CREW:
                await this.prisma.userCrewFavorite.create({
                    data: { userId, crewId: itemId },
                });
                break;
            case FavoriteType.SEASONS:
                await this.prisma.userSeasonFavorite.create({
                    data: { userId, seasonId: itemId },
                });
                break;
            case FavoriteType.EPISODES:
                await this.prisma.userEpisodeFavorite.create({
                    data: { userId, episodeId: itemId },
                });
                break;
        }
    }

    private async deleteFavorite(userId: number, itemId: number, type: FavoriteType): Promise<void> {
        switch (type) {
            case FavoriteType.MOVIES:
                await this.prisma.userMovieFavorite.deleteMany({
                    where: { userId, movieId: itemId },
                });
                break;
            case FavoriteType.SERIES:
                await this.prisma.userSerieFavorite.deleteMany({
                    where: { userId, serieId: itemId },
                });
                break;
            case FavoriteType.ACTORS:
                await this.prisma.userActorFavorite.deleteMany({
                    where: { userId, actorId: itemId },
                });
                break;
            case FavoriteType.CREW:
                await this.prisma.userCrewFavorite.deleteMany({
                    where: { userId, crewId: itemId },
                });
                break;
            case FavoriteType.SEASONS:
                await this.prisma.userSeasonFavorite.deleteMany({
                    where: { userId, seasonId: itemId },
                });
                break;
            case FavoriteType.EPISODES:
                await this.prisma.userEpisodeFavorite.deleteMany({
                    where: { userId, episodeId: itemId },
                });
                break;
        }
    }

    private async getFavoritesQuery(
        userId: number,
        type: FavoriteType,
        skip: number,
        take: number,
        search: string = "",
    ): Promise<any[]> {
        switch (type) {
            case FavoriteType.MOVIES:
                return this.prisma.userMovieFavorite.findMany({
                    where: {
                        userId,
                        movie: { title: { contains: search } },
                    },
                    include: { movie: true },
                    skip,
                    take,
                    orderBy: { id: "desc" },
                });
            case FavoriteType.SERIES:
                return this.prisma.userSerieFavorite.findMany({
                    where: {
                        userId,
                        serie: { title: { contains: search } },
                    },
                    include: { serie: true },
                    skip,
                    take,
                    orderBy: { id: "desc" },
                });
            case FavoriteType.ACTORS:
                return this.prisma.userActorFavorite.findMany({
                    where: {
                        userId,
                        actor: { fullname: { contains: search } },
                    },
                    include: { actor: true },
                    skip,
                    take,
                    orderBy: { id: "desc" },
                });
            case FavoriteType.CREW:
                return this.prisma.userCrewFavorite.findMany({
                    where: {
                        userId,
                        crew: { fullname: { contains: search } },
                    },
                    include: { crew: true },
                    skip,
                    take,
                    orderBy: { id: "desc" },
                });
            case FavoriteType.SEASONS:
                return this.prisma.userSeasonFavorite.findMany({
                    where: { userId },
                    include: { season: true },
                    skip,
                    take,
                    orderBy: { id: "desc" },
                });
            case FavoriteType.EPISODES:
                return this.prisma.userEpisodeFavorite.findMany({
                    where: { userId },
                    include: { episode: true },
                    skip,
                    take,
                    orderBy: { id: "desc" },
                });
        }
    }

    private async getFavoritesCount(userId: number, type?: FavoriteType, search: string = ""): Promise<number> {
        if (!type) {
            const [movies, series, actors, crew, seasons, episodes] = await Promise.all([
                this.prisma.userMovieFavorite.count({ where: { userId } }),
                this.prisma.userSerieFavorite.count({ where: { userId } }),
                this.prisma.userActorFavorite.count({ where: { userId } }),
                this.prisma.userCrewFavorite.count({ where: { userId } }),
                this.prisma.userSeasonFavorite.count({ where: { userId } }),
                this.prisma.userEpisodeFavorite.count({ where: { userId } }),
            ]);
            return movies + series + actors + crew + seasons + episodes;
        }

        switch (type) {
            case FavoriteType.MOVIES:
                return this.prisma.userMovieFavorite.count({
                    where: {
                        userId,
                        movie: { title: { contains: search } },
                    },
                });
            case FavoriteType.SERIES:
                return this.prisma.userSerieFavorite.count({
                    where: {
                        userId,
                        serie: { title: { contains: search } },
                    },
                });
            case FavoriteType.ACTORS:
                return this.prisma.userActorFavorite.count({
                    where: {
                        userId,
                        actor: { fullname: { contains: search } },
                    },
                });
            case FavoriteType.CREW:
                return this.prisma.userCrewFavorite.count({
                    where: {
                        userId,
                        crew: { fullname: { contains: search } },
                    },
                });
            case FavoriteType.SEASONS:
                return this.prisma.userSeasonFavorite.count({ where: { userId } });
            case FavoriteType.EPISODES:
                return this.prisma.userEpisodeFavorite.count({ where: { userId } });
        }
    }

    private async getReviewsCount(userId: number): Promise<number> {
        const [movies, series, seasons, episodes, actors, crew] = await Promise.all([
            this.prisma.movieReview.count({ where: { userId } }),
            this.prisma.serieReview.count({ where: { userId } }),
            this.prisma.seasonReview.count({ where: { userId } }),
            this.prisma.episodeReview.count({ where: { userId } }),
            this.prisma.actorReview.count({ where: { userId } }),
            this.prisma.crewReview.count({ where: { userId } }),
        ]);

        return movies + series + seasons + episodes + actors + crew;
    }

    async addReview(userId: number, itemId: number, itemType: string, content: string, rating: number): Promise<any> {
        const favoriteType = this.convertReviewTypeToFavoriteType(itemType);
        await this.validateItemExists(itemId, favoriteType);

        const existingReview = await this.checkReviewExists(userId, itemId, itemType);
        if (existingReview) {
            throw new ConflictException("You have already reviewed this item");
        }

        return this.createReview(userId, itemId, itemType, content, rating);
    }

    async updateReview(
        userId: number,
        itemId: number,
        itemType: string,
        content: string,
        rating: number,
    ): Promise<any> {
        const review = await this.findReview(userId, itemId, itemType);
        if (!review) {
            throw new NotFoundException("Review not found");
        }

        return this.updateReviewData(itemType, review.id, content, rating);
    }

    async removeReview(userId: number, itemId: number, itemType: string): Promise<void> {
        const review = await this.findReview(userId, itemId, itemType);
        if (!review) {
            throw new NotFoundException("Review not found");
        }

        await this.deleteReview(itemType, review.id);
    }

    async getUserForumTopics(
        userId: number,
        page: number = 1,
        search: string = "",
        sortBy: string = "createdAt",
        sortOrder: "asc" | "desc" = "asc",
    ): Promise<any> {
        const perPage = 10;
        const skip = (page - 1) * perPage;

        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        const [topics, total] = await Promise.all([
            this.prisma.forumTopic.findMany({
                where: {
                    userId,
                    title: {
                        contains: search,
                    },
                },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                    tags: true,
                    _count: {
                        select: {
                            posts: true,
                            upvotes: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: perPage,
            }),
            this.prisma.forumTopic.count({
                where: {
                    userId,
                    title: {
                        contains: search,
                    },
                },
            }),
        ]);

        return {
            items: topics,
            total,
            page,
            perPage,
        };
    }

    async getUserForumReplies(
        userId: number,
        page: number = 1,
        search: string = "",
        sortBy: string = "createdAt",
        sortOrder: "asc" | "desc" = "asc",
    ): Promise<any> {
        const perPage = 10;
        const skip = (page - 1) * perPage;

        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        const [replies, total] = await Promise.all([
            this.prisma.forumReply.findMany({
                where: {
                    userId,
                    content: {
                        contains: search,
                    },
                },
                include: {
                    post: {
                        select: {
                            id: true,
                            content: true,
                            topic: {
                                select: {
                                    id: true,
                                    title: true,
                                    slug: true,
                                    categoryId: true,
                                    category: {
                                        select: {
                                            id: true,
                                            name: true,
                                            slug: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            upvotes: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: perPage,
            }),
            this.prisma.forumReply.count({
                where: {
                    userId,
                    content: {
                        contains: search,
                    },
                },
            }),
        ]);

        return {
            items: replies,
            total,
            page,
            perPage,
        };
    }

    private async checkReviewExists(userId: number, itemId: number, itemType: string): Promise<boolean> {
        switch (itemType) {
            case "movie":
                return !!(await this.prisma.movieReview.findFirst({
                    where: { userId, movieId: itemId },
                }));
            case "serie":
                return !!(await this.prisma.serieReview.findFirst({
                    where: { userId, serieId: itemId },
                }));
            case "season":
                return !!(await this.prisma.seasonReview.findFirst({
                    where: { userId, seasonId: itemId },
                }));
            case "episode":
                return !!(await this.prisma.episodeReview.findFirst({
                    where: { userId, episodeId: itemId },
                }));
            case "actor":
                return !!(await this.prisma.actorReview.findFirst({
                    where: { userId, actorId: itemId },
                }));
            case "crew":
                return !!(await this.prisma.crewReview.findFirst({
                    where: { userId, crewId: itemId },
                }));
            default:
                throw new BadRequestException("Invalid item type");
        }
    }

    private async findReview(userId: number, itemId: number, itemType: string): Promise<any> {
        switch (itemType) {
            case "movie":
                return this.prisma.movieReview.findFirst({
                    where: { userId, movieId: itemId },
                });
            case "serie":
                return this.prisma.serieReview.findFirst({
                    where: { userId, serieId: itemId },
                });
            case "season":
                return this.prisma.seasonReview.findFirst({
                    where: { userId, seasonId: itemId },
                });
            case "episode":
                return this.prisma.episodeReview.findFirst({
                    where: { userId, episodeId: itemId },
                });
            case "actor":
                return this.prisma.actorReview.findFirst({
                    where: { userId, actorId: itemId },
                });
            case "crew":
                return this.prisma.crewReview.findFirst({
                    where: { userId, crewId: itemId },
                });
            default:
                throw new BadRequestException("Invalid item type");
        }
    }

    private async createReview(
        userId: number,
        itemId: number,
        itemType: string,
        content: string,
        rating: number,
    ): Promise<any> {
        const data = {
            content,
            rating,
            userId,
            createdAt: new Date(),
        };

        switch (itemType) {
            case "movie":
                return this.prisma.movieReview.create({
                    data: { ...data, movieId: itemId },
                });
            case "serie":
                return this.prisma.serieReview.create({
                    data: { ...data, serieId: itemId },
                });
            case "season":
                return this.prisma.seasonReview.create({
                    data: { ...data, seasonId: itemId },
                });
            case "episode":
                return this.prisma.episodeReview.create({
                    data: { ...data, episodeId: itemId },
                });
            case "actor":
                return this.prisma.actorReview.create({
                    data: { ...data, actorId: itemId },
                });
            case "crew":
                return this.prisma.crewReview.create({
                    data: { ...data, crewId: itemId },
                });
            default:
                throw new BadRequestException("Invalid item type");
        }
    }

    private async updateReviewData(itemType: string, reviewId: number, content: string, rating: number): Promise<any> {
        const data = { content, rating };

        switch (itemType) {
            case "movie":
                return this.prisma.movieReview.update({
                    where: { id: reviewId },
                    data,
                });
            case "serie":
                return this.prisma.serieReview.update({
                    where: { id: reviewId },
                    data,
                });
            case "season":
                return this.prisma.seasonReview.update({
                    where: { id: reviewId },
                    data,
                });
            case "episode":
                return this.prisma.episodeReview.update({
                    where: { id: reviewId },
                    data,
                });
            case "actor":
                return this.prisma.actorReview.update({
                    where: { id: reviewId },
                    data,
                });
            case "crew":
                return this.prisma.crewReview.update({
                    where: { id: reviewId },
                    data,
                });
            default:
                throw new BadRequestException("Invalid item type");
        }
    }

    private async deleteReview(itemType: string, reviewId: number): Promise<void> {
        switch (itemType) {
            case "movie":
                await this.prisma.movieReview.delete({ where: { id: reviewId } });
                break;
            case "serie":
                await this.prisma.serieReview.delete({ where: { id: reviewId } });
                break;
            case "season":
                await this.prisma.seasonReview.delete({ where: { id: reviewId } });
                break;
            case "episode":
                await this.prisma.episodeReview.delete({ where: { id: reviewId } });
                break;
            case "actor":
                await this.prisma.actorReview.delete({ where: { id: reviewId } });
                break;
            case "crew":
                await this.prisma.crewReview.delete({ where: { id: reviewId } });
                break;
            default:
                throw new BadRequestException("Invalid item type");
        }
    }
}
