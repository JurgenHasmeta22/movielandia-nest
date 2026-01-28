import { Test, TestingModule } from "@nestjs/testing";
import { ActorController } from "./actor.controller";
import { ActorService } from "./actor.service";
import { mockActor, mockActorWithDetails } from "./actor.mock-data";

describe("ActorController", () => {
    let controller: ActorController;
    let service: ActorService;

    const mockActorService = {
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
            controllers: [ActorController],
            providers: [
                {
                    provide: ActorService,
                    useValue: mockActorService,
                },
            ],
        }).compile();

        controller = module.get<ActorController>(ActorController);
        service = module.get<ActorService>(ActorService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("findAll", () => {
        it("should return a list of actors", async () => {
            const mockResult = {
                actors: [mockActorWithDetails],
                count: 1,
            };

            jest.spyOn(service, "findAll").mockResolvedValue(mockResult);

            const result = await controller.findAll({}, undefined);

            expect(result).toEqual(mockResult);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe("findOne", () => {
        it("should return an actor by id", async () => {
            jest.spyOn(service, "findOne").mockResolvedValue(mockActorWithDetails);

            const result = await controller.findOne(mockActor.id);

            expect(result).toEqual(mockActorWithDetails);
            expect(service.findOne).toHaveBeenCalledWith(mockActor.id, undefined);
        });
    });

    describe("create", () => {
        it("should create a new actor", async () => {
            jest.spyOn(service, "create").mockResolvedValue(mockActorWithDetails);

            const result = await controller.create({
                fullname: "Tom Hanks",
                description: "American actor",
                photoSrc: "http://example.com/photo.jpg",
                photoSrcProd: "http://example.com/photo-prod.jpg",
                debut: "1980",
            });

            expect(result).toEqual(mockActorWithDetails);
            expect(service.create).toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        it("should delete an actor", async () => {
            jest.spyOn(service, "remove").mockResolvedValue(undefined);

            await controller.remove(mockActor.id);

            expect(service.remove).toHaveBeenCalledWith(mockActor.id);
        });
    });

    describe("count", () => {
        it("should return the count of actors", async () => {
            jest.spyOn(service, "count").mockResolvedValue(256);

            const result = await controller.count();

            expect(result).toEqual({ count: 256 });
            expect(service.count).toHaveBeenCalled();
        });
    });
});
