import { Test, TestingModule } from "@nestjs/testing";
import { CrewController } from "./crew.controller";
import { CrewService } from "./crew.service";
import { mockCrew, mockCrewWithDetails } from "./crew.mock-data";

describe("CrewController", () => {
    let controller: CrewController;
    let service: CrewService;

    const mockCrewService = {
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
            controllers: [CrewController],
            providers: [
                {
                    provide: CrewService,
                    useValue: mockCrewService,
                },
            ],
        }).compile();

        controller = module.get<CrewController>(CrewController);
        service = module.get<CrewService>(CrewService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("findAll", () => {
        it("should return a list of crew members", async () => {
            const mockResult = {
                crew: [mockCrewWithDetails],
                count: 1,
            };

            jest.spyOn(service, "findAll").mockResolvedValue(mockResult);

            const result = await controller.findAll({}, undefined);

            expect(result).toEqual(mockResult);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe("findOne", () => {
        it("should return a crew member by id", async () => {
            jest.spyOn(service, "findOne").mockResolvedValue(mockCrewWithDetails);

            const result = await controller.findOne(mockCrew.id);

            expect(result).toEqual(mockCrewWithDetails);
            expect(service.findOne).toHaveBeenCalledWith(mockCrew.id, undefined);
        });
    });

    describe("create", () => {
        it("should create a new crew member", async () => {
            jest.spyOn(service, "create").mockResolvedValue(mockCrewWithDetails);

            const result = await controller.create({
                fullname: "Steven Spielberg",
                role: "Director",
                description: "American filmmaker",
                photoSrc: "http://example.com/photo.jpg",
                photoSrcProd: "http://example.com/photo-prod.jpg",
                debut: "1971",
            });

            expect(result).toEqual(mockCrewWithDetails);
            expect(service.create).toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        it("should delete a crew member", async () => {
            jest.spyOn(service, "remove").mockResolvedValue(undefined);

            await controller.remove(mockCrew.id);

            expect(service.remove).toHaveBeenCalledWith(mockCrew.id);
        });
    });

    describe("count", () => {
        it("should return the count of crew members", async () => {
            jest.spyOn(service, "count").mockResolvedValue(89);

            const result = await controller.count();

            expect(result).toEqual({ count: 89 });
            expect(service.count).toHaveBeenCalled();
        });
    });
});
