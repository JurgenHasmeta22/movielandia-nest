import { Test, TestingModule } from "@nestjs/testing";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";
import { MovieQueryDto, SortOrder } from "./dtos/movie-query.dto";
import { CreateMovieDto } from "./dtos/create-movie.dto";
import { UpdateMovieDto } from "./dtos/update-movie.dto";
import { User } from "@prisma/client";
import { mockMovie, mockMovieWithDetails } from "./movie.mock-data";

describe("MovieController", () => {
    let controller: MovieController;
    let movieService: MovieService;

    const mockUser: User = {
        id: 1,
        email: "test@example.com",
        userName: "testuser",
        password: "hashedPassword",
        role: "User",
        bio: "",
        age: 25,
        birthday: new Date(),
        gender: "Male",
        phone: "",
        countryFrom: "",
        active: true,
        canResetPassword: true,
        subscribed: false,
    };

    const mockMovieService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        findLatest: jest.fn(),
        findRelated: jest.fn(),
        search: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        count: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MovieController],
            providers: [
                {
                    provide: MovieService,
                    useValue: mockMovieService,
                },
            ],
        }).compile();

        controller = module.get<MovieController>(MovieController);
        movieService = module.get<MovieService>(MovieService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findAll", () => {
        const mockQuery: MovieQueryDto = {
            sortBy: "title",
            ascOrDesc: SortOrder.ASC,
            page: 1,
        };

        it("should return movies list with optional user", async () => {
            mockMovieService.findAll.mockResolvedValue({ movies: [mockMovieWithDetails] });

            const result = await controller.findAll(mockQuery, mockUser);

            expect(result).toEqual({ movies: [mockMovieWithDetails] });
            expect(mockMovieService.findAll).toHaveBeenCalledWith(mockQuery, mockUser.id);
        });

        it("should handle request without user", async () => {
            mockMovieService.findAll.mockResolvedValue({ movies: [mockMovie] });

            const result = await controller.findAll(mockQuery);

            expect(result).toEqual({ movies: [mockMovie] });
            expect(mockMovieService.findAll).toHaveBeenCalledWith(mockQuery, undefined);
        });
    });

    describe("findOne", () => {
        it("should return a single movie with optional user", async () => {
            mockMovieService.findOne.mockResolvedValue(mockMovieWithDetails);

            const result = await controller.findOne(1, mockUser);

            expect(result).toEqual(mockMovieWithDetails);
            expect(mockMovieService.findOne).toHaveBeenCalledWith(1, mockUser.id);
        });
    });

    describe("findLatest", () => {
        it("should return latest movies with optional user", async () => {
            mockMovieService.findLatest.mockResolvedValue([mockMovieWithDetails]);

            const result = await controller.findLatest(mockUser);

            expect(result).toEqual([mockMovieWithDetails]);
            expect(mockMovieService.findLatest).toHaveBeenCalledWith(mockUser.id);
        });
    });

    describe("findRelated", () => {
        it("should return related movies with pagination", async () => {
            mockMovieService.findRelated.mockResolvedValue({
                movies: [mockMovieWithDetails],
                count: 1,
            });

            const result = await controller.findRelated(1, 1, 6, mockUser);

            expect(result).toEqual({ movies: [mockMovieWithDetails], count: 1 });
            expect(mockMovieService.findRelated).toHaveBeenCalledWith(1, mockUser.id, 1, 6);
        });
    });

    describe("search", () => {
        const mockQuery: MovieQueryDto = {
            sortBy: "title",
            ascOrDesc: SortOrder.ASC,
            page: 1,
        };

        it("should return search results with optional user", async () => {
            mockMovieService.search.mockResolvedValue({
                movies: [mockMovieWithDetails],
                count: 1,
            });

            const result = await controller.search("test", mockQuery, mockUser);

            expect(result).toEqual({ movies: [mockMovieWithDetails], count: 1 });
            expect(mockMovieService.search).toHaveBeenCalledWith("test", mockQuery, mockUser.id);
        });
    });

    describe("create", () => {
        it("should create a new movie", async () => {
            const createDto: CreateMovieDto = {
                title: "New Movie",
                description: "A new movie",
                photoSrc: "new.jpg",
                photoSrcProd: "new-prod.jpg",
                trailerSrc: "new-trailer.mp4",
                duration: 130,
                dateAired: new Date("2024-02-01"),
                ratingImdb: 8.0,
            };

            mockMovieService.create.mockResolvedValue({ ...mockMovie, ...createDto });

            const result = await controller.create(createDto);

            expect(result).toEqual(expect.objectContaining(createDto));
            expect(mockMovieService.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe("update", () => {
        it("should update an existing movie", async () => {
            const updateDto: UpdateMovieDto = {
                title: "Updated Movie",
            };

            mockMovieService.update.mockResolvedValue({ ...mockMovie, ...updateDto });

            const result = await controller.update(1, updateDto);

            expect(result).toEqual(expect.objectContaining({ title: "Updated Movie" }));
            expect(mockMovieService.update).toHaveBeenCalledWith(1, updateDto);
        });
    });

    describe("remove", () => {
        it("should delete a movie", async () => {
            await controller.remove(1);

            expect(mockMovieService.remove).toHaveBeenCalledWith(1);
        });
    });

    describe("count", () => {
        it("should return total movies count", async () => {
            mockMovieService.count.mockResolvedValue(100);

            const result = await controller.count();

            expect(result).toEqual({ count: 100 });
            expect(mockMovieService.count).toHaveBeenCalled();
        });
    });
});
