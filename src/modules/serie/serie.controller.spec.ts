import { Test, TestingModule } from "@nestjs/testing";
import { SerieController } from "./serie.controller";
import { SerieService } from "./serie.service";
import { mockSerie, mockSerieWithDetails } from "./serie.mock-data";

describe("SerieController", () => {
    let controller: SerieController;
    let service: SerieService;

    const mockSerieService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        findLatest: jest.fn(),
        search: jest.fn(),
        findRelated: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        count: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SerieController],
            providers: [
                {
                    provide: SerieService,
                    useValue: mockSerieService,
                },
            ],
        }).compile();

        controller = module.get<SerieController>(SerieController);
        service = module.get<SerieService>(SerieService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("findAll", () => {
        it("should return a list of series", async () => {
            const mockResult = {
                series: [mockSerieWithDetails],
                count: 1,
            };

            jest.spyOn(service, "findAll").mockResolvedValue(mockResult);

            const result = await controller.findAll({}, undefined);

            expect(result).toEqual(mockResult);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe("findOne", () => {
        it("should return a serie by id", async () => {
            jest.spyOn(service, "findOne").mockResolvedValue(mockSerieWithDetails);

            const result = await controller.findOne(mockSerie.id);

            expect(result).toEqual(mockSerieWithDetails);
            expect(service.findOne).toHaveBeenCalledWith(mockSerie.id, undefined);
        });
    });

    describe("create", () => {
        it("should create a new serie", async () => {
            jest.spyOn(service, "create").mockResolvedValue(mockSerieWithDetails);

            const result = await controller.create({
                title: "New Serie",
                description: "A new serie",
                photoSrc: "http://example.com/photo.jpg",
                photoSrcProd: "http://example.com/photo-prod.jpg",
                trailerSrc: "http://example.com/trailer.mp4",
                ratingImdb: 8.0,
            });

            expect(result).toEqual(mockSerieWithDetails);
            expect(service.create).toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        it("should delete a serie", async () => {
            jest.spyOn(service, "remove").mockResolvedValue(undefined);

            await controller.remove(mockSerie.id);

            expect(service.remove).toHaveBeenCalledWith(mockSerie.id);
        });
    });

    describe("count", () => {
        it("should return the count of series", async () => {
            jest.spyOn(service, "count").mockResolvedValue(42);

            const result = await controller.count();

            expect(result).toEqual({ count: 42 });
            expect(service.count).toHaveBeenCalled();
        });
    });
});
