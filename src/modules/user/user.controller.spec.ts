import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaService } from "../../prisma.service";
import { userMockData } from "./user.mock-data";

describe("UserController", () => {
    let controller: UserController;
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        getUsersWithFilters: jest.fn().mockResolvedValue({
                            users: userMockData.users,
                            total: 2,
                            page: 1,
                            perPage: 12,
                        }),
                        getUserById: jest.fn().mockResolvedValue(userMockData.userProfile),
                        addFavorite: jest.fn().mockResolvedValue(undefined),
                        removeFavorite: jest.fn().mockResolvedValue(undefined),
                        getFavorites: jest.fn().mockResolvedValue({
                            items: userMockData.favorites,
                            total: 2,
                            page: 1,
                            perPage: 10,
                        }),
                        follow: jest.fn().mockResolvedValue(undefined),
                        unfollow: jest.fn().mockResolvedValue(undefined),
                    },
                },
                {
                    provide: PrismaService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("findAll", () => {
        it("should return paginated users", async () => {
            const result = await controller.findAll({
                page: 1,
                perPage: 12,
                userName: undefined,
                sortBy: "userName",
                ascOrDesc: "asc",
            });

            expect(result).toEqual({
                users: userMockData.users,
                total: 2,
                page: 1,
                perPage: 12,
            });
            expect(service.getUsersWithFilters).toHaveBeenCalled();
        });
    });

    describe("findOne", () => {
        it("should return a single user profile", async () => {
            const result = await controller.findOne(1);

            expect(result).toEqual(userMockData.userProfile);
            expect(service.getUserById).toHaveBeenCalledWith(1);
        });
    });
});
