import { Test, TestingModule } from "@nestjs/testing";
import { GenreController } from "./genre.controller";
import { GenreService } from "./genre.service";
import { mockGenre } from "./genre.mock-data";

describe("GenreController", () => {
    let controller: GenreController;
    let service: GenreService;

    const mockGenreService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        search: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        count: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GenreController],
            providers: [
                {
                    provide: GenreService,
                    useValue: mockGenreService,
                },
            ],
        }).compile();

        controller = module.get<GenreController>(GenreController);
        service = module.get<GenreService>(GenreService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("findAll", () => {
        it("should return a list of genres", async () => {
            const mockResult = {
                genres: [mockGenre],
                count: 1,
            };

            jest.spyOn(service, "findAll").mockResolvedValue(mockResult);

            const result = await controller.findAll({}, undefined);

            expect(result).toEqual(mockResult);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe("findOne", () => {
        it("should return a genre by id", async () => {
            jest.spyOn(service, "findOne").mockResolvedValue(mockGenre);

            const result = await controller.findOne(mockGenre.id);

            expect(result).toEqual(mockGenre);
            expect(service.findOne).toHaveBeenCalledWith(mockGenre.id, undefined);
        });
    });

    describe("create", () => {
        it("should create a new genre", async () => {
            jest.spyOn(service, "create").mockResolvedValue(mockGenre);

            const result = await controller.create({
                name: "Action",
            });

            expect(result).toEqual(mockGenre);
            expect(service.create).toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        it("should delete a genre", async () => {
            jest.spyOn(service, "remove").mockResolvedValue(undefined);

            await controller.remove(mockGenre.id);

            expect(service.remove).toHaveBeenCalledWith(mockGenre.id);
        });
    });

    describe("count", () => {
        it("should return the count of genres", async () => {
            jest.spyOn(service, "count").mockResolvedValue(15);

            const result = await controller.count();

            expect(result).toEqual({ count: 15 });
            expect(service.count).toHaveBeenCalled();
        });
    });
});
