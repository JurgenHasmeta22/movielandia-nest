import { Test, TestingModule } from "@nestjs/testing";
import { MovieService } from "./movie.service";
import { PrismaService } from "../../prisma.service";
import { Movie } from "@prisma/client";
import { MovieQueryDto, SortOrder } from "./dtos/movie-query.dto";
import { CreateMovieDto } from "./dtos/create-movie.dto";
import { UpdateMovieDto } from "./dtos/update-movie.dto";
import { NotFoundException } from "@nestjs/common";

describe("MovieService", () => {
    let service: MovieService;
    let prisma: PrismaService;

    const mockMovie: Movie = {
        id: 1,
        title: "Test Movie",
        description: "A test movie",
        photoSrc: "test.jpg",
        photoSrcProd: "test-prod.jpg",
        trailerSrc: "trailer.mp4",
        duration: 120,
        dateAired: new Date("2024-01-01"),
        ratingImdb: 8.5,
    } as Movie;

    const mockPrismaService = {
        movie: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        movieReview: {
            groupBy: jest.fn(),
            count: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
        },
        movieGenre: {
            findMany: jest.fn(),
        },
        userMovieFavorite: {
            findFirst: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MovieService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<MovieService>(MovieService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findAll", () => {
        const mockQuery: MovieQueryDto = {
            sortBy: "title",
            ascOrDesc: SortOrder.ASC,
            perPage: 12,
            page: 1,
        };

        it("should return movies with ratings and bookmark info", async () => {
            mockPrismaService.movie.findMany.mockResolvedValue([mockMovie]);
            mockPrismaService.movieReview.groupBy.mockResolvedValue([
                {
                    movieId: 1,
                    _avg: { rating: 4.5 },
                    _count: { rating: 10 },
                },
            ]);
            mockPrismaService.userMovieFavorite.findFirst.mockResolvedValue({ id: 1 });

            const result = await service.findAll(mockQuery, 1);

            expect(result.movies[0]).toEqual(
                expect.objectContaining({
                    ...mockMovie,
                    averageRating: 4.5,
                    totalReviews: 10,
                    isBookmarked: true,
                }),
            );
        });

        it("should apply filters correctly", async () => {
            const queryWithFilters: MovieQueryDto = {
                ...mockQuery,
                title: "test",
                filterNameString: "duration",
                filterOperatorString: "contains",
                filterValue: "120",
            };

            await service.findAll(queryWithFilters);

            expect(mockPrismaService.movie.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        title: { contains: "test" },
                        duration: { contains: "120" },
                    }),
                }),
            );
        });
    });

    describe("findOne", () => {
        it("should return a movie with details", async () => {
            mockPrismaService.movie.findFirst.mockResolvedValue(mockMovie);
            mockPrismaService.movieReview.groupBy.mockResolvedValue([
                {
                    movieId: 1,
                    _avg: { rating: 4.5 },
                    _count: { rating: 10 },
                },
            ]);

            const result = await service.findOne(1);

            expect(result).toEqual(
                expect.objectContaining({
                    ...mockMovie,
                    averageRating: 4.5,
                    totalReviews: 10,
                }),
            );
        });

        it("should throw NotFoundException when movie not found", async () => {
            mockPrismaService.movie.findFirst.mockResolvedValue(null);

            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
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

            mockPrismaService.movie.create.mockResolvedValue({ ...mockMovie, ...createDto });

            const result = await service.create(createDto);

            expect(result).toEqual(expect.objectContaining(createDto));
            expect(mockPrismaService.movie.create).toHaveBeenCalledWith({
                data: { ...createDto, title: createDto.title.toLowerCase() },
                include: { genres: { select: { genre: true } } },
            });
        });
    });

    describe("update", () => {
        const updateDto: UpdateMovieDto = {
            title: "Updated Movie",
        };

        it("should update an existing movie", async () => {
            mockPrismaService.movie.findFirst.mockResolvedValue(mockMovie);
            mockPrismaService.movie.update.mockResolvedValue({ ...mockMovie, ...updateDto });

            const result = await service.update(1, updateDto);

            expect(result).toEqual(expect.objectContaining({ title: "Updated Movie" }));
            expect(mockPrismaService.movie.findFirst).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it("should throw NotFoundException when movie not found", async () => {
            mockPrismaService.movie.findFirst.mockResolvedValue(null);

            await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe("remove", () => {
        it("should delete an existing movie", async () => {
            mockPrismaService.movie.findFirst.mockResolvedValue(mockMovie);
            mockPrismaService.movie.delete.mockResolvedValue(mockMovie);

            await expect(service.remove(1)).resolves.not.toThrow();
            expect(mockPrismaService.movie.findFirst).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(mockPrismaService.movie.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it("should throw NotFoundException when movie not found", async () => {
            mockPrismaService.movie.findFirst.mockResolvedValue(null);

            await expect(service.remove(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe("search", () => {
        const mockQuery: MovieQueryDto = {
            sortBy: "title",
            ascOrDesc: SortOrder.ASC,
            page: 1,
        };

        it("should return search results with pagination", async () => {
            mockPrismaService.movie.findMany.mockResolvedValue([mockMovie]);
            mockPrismaService.movie.count.mockResolvedValue(1);
            mockPrismaService.movieReview.groupBy.mockResolvedValue([
                {
                    movieId: 1,
                    _avg: { rating: 4.5 },
                    _count: { rating: 10 },
                },
            ]);

            const result = await service.search("test", mockQuery);

            expect(result).toEqual({
                movies: expect.arrayContaining([
                    expect.objectContaining({
                        ...mockMovie,
                        averageRating: 4.5,
                        totalReviews: 10,
                    }),
                ]),
                count: 1,
            });
        });
    });

    describe("findRelated", () => {
        it("should return related movies based on genres", async () => {
            mockPrismaService.movie.findFirst.mockResolvedValue(mockMovie);
            mockPrismaService.movieGenre.findMany
                .mockResolvedValueOnce([{ genreId: 1 }])
                .mockResolvedValueOnce([{ movieId: 2 }]);
            mockPrismaService.movie.findMany.mockResolvedValue([{ ...mockMovie, id: 2 }]);
            mockPrismaService.movieReview.groupBy.mockResolvedValue([
                {
                    movieId: 2,
                    _avg: { rating: 4.5 },
                    _count: { rating: 10 },
                },
            ]);

            const result = await service.findRelated(1);

            expect(result).toEqual({
                movies: expect.arrayContaining([
                    expect.objectContaining({
                        id: 2,
                        averageRating: 4.5,
                        totalReviews: 10,
                    }),
                ]),
                count: 1,
            });
        });

        it("should return null when no related movies found", async () => {
            mockPrismaService.movie.findFirst.mockResolvedValue(mockMovie);
            mockPrismaService.movieGenre.findMany.mockResolvedValue([]);

            const result = await service.findRelated(1);

            expect(result).toEqual({ movies: null, count: 0 });
        });
    });

    describe("findLatest", () => {
        it("should return latest movies with ratings", async () => {
            mockPrismaService.movie.findMany.mockResolvedValue([mockMovie]);
            mockPrismaService.movieReview.groupBy.mockResolvedValue([
                {
                    movieId: 1,
                    _avg: { rating: 4.5 },
                    _count: { rating: 10 },
                },
            ]);

            const result = await service.findLatest();

            expect(result[0]).toEqual(
                expect.objectContaining({
                    ...mockMovie,
                    averageRating: 4.5,
                    totalReviews: 10,
                }),
            );
            expect(mockPrismaService.movie.findMany).toHaveBeenCalledWith({
                orderBy: { dateAired: "desc" },
                take: 6,
            });
        });
    });

    describe("count", () => {
        it("should return total number of movies", async () => {
            mockPrismaService.movie.count.mockResolvedValue(100);

            const result = await service.count();

            expect(result).toBe(100);
        });
    });
});
