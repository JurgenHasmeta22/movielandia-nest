import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { PrismaService } from "../../prisma.service";
import { FavoriteType } from "./dtos/user.dto";
import { userMockData } from "./user.mock-data";

describe("UserService", () => {
    let service: UserService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            findMany: jest.fn().mockResolvedValue(userMockData.users),
                            findUnique: jest.fn().mockResolvedValue(userMockData.userProfile),
                            count: jest.fn().mockResolvedValue(2),
                        },
                        userFollow: {
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                            count: jest.fn().mockResolvedValue(0),
                        },
                        message: {
                            findMany: jest.fn().mockResolvedValue(userMockData.messages),
                            count: jest.fn().mockResolvedValue(1),
                            create: jest.fn().mockResolvedValue(userMockData.messages[0]),
                            delete: jest.fn(),
                            findUnique: jest.fn().mockResolvedValue(userMockData.messages[0]),
                        },
                        userMovieFavorite: {
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            deleteMany: jest.fn(),
                            findMany: jest.fn().mockResolvedValue([]),
                            count: jest.fn().mockResolvedValue(0),
                        },
                        userSerieFavorite: {
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            deleteMany: jest.fn(),
                            findMany: jest.fn().mockResolvedValue([]),
                            count: jest.fn().mockResolvedValue(0),
                        },
                        userActorFavorite: {
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            deleteMany: jest.fn(),
                            findMany: jest.fn().mockResolvedValue([]),
                            count: jest.fn().mockResolvedValue(0),
                        },
                        userCrewFavorite: {
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            deleteMany: jest.fn(),
                            findMany: jest.fn().mockResolvedValue([]),
                            count: jest.fn().mockResolvedValue(0),
                        },
                        userSeasonFavorite: {
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            deleteMany: jest.fn(),
                            findMany: jest.fn().mockResolvedValue([]),
                            count: jest.fn().mockResolvedValue(0),
                        },
                        userEpisodeFavorite: {
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            deleteMany: jest.fn(),
                            findMany: jest.fn().mockResolvedValue([]),
                            count: jest.fn().mockResolvedValue(0),
                        },
                        movie: {
                            findUnique: jest.fn().mockResolvedValue({ id: 1, title: "Inception" }),
                        },
                        serie: {
                            findUnique: jest.fn().mockResolvedValue({ id: 1, title: "Breaking Bad" }),
                        },
                        movieReview: {
                            count: jest.fn().mockResolvedValue(0),
                        },
                        serieReview: {
                            count: jest.fn().mockResolvedValue(0),
                        },
                        seasonReview: {
                            count: jest.fn().mockResolvedValue(0),
                        },
                        episodeReview: {
                            count: jest.fn().mockResolvedValue(0),
                        },
                        actorReview: {
                            count: jest.fn().mockResolvedValue(0),
                        },
                        crewReview: {
                            count: jest.fn().mockResolvedValue(0),
                        },
                        $transaction: jest.fn().mockResolvedValue([]),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getUsersWithFilters", () => {
        it("should return paginated users", async () => {
            const result = await service.getUsersWithFilters({
                page: 1,
                perPage: 12,
                userName: undefined,
            });

            expect(result.users).toEqual(userMockData.users);
            expect(result.total).toBe(2);
        });
    });

    describe("getUserById", () => {
        it("should return user profile with stats", async () => {
            const result = await service.getUserById(1);

            expect(result).toBeDefined();
            expect(result.id).toBe(1);
        });
    });
});
