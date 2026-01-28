import { Test, TestingModule } from "@nestjs/testing";
import { ActorService } from "./actor.service";
import { PrismaService } from "../../prisma.service";
import { ActorQueryDto, SortOrder } from "./dtos/actor-query.dto";
import { CreateActorDto } from "./dtos/create-actor.dto";
import { UpdateActorDto } from "./dtos/update-actor.dto";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockActor, mockActorRatingInfo, mockActorWithDetails } from "./actor.mock-data";

describe("ActorService", () => {
    let service: ActorService;
    let prisma: PrismaService;

    const mockPrismaService = {
        actor: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        actorReview: {
            groupBy: jest.fn(),
            findFirst: jest.fn(),
        },
        userActorFavorite: {
            findFirst: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ActorService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ActorService>(ActorService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findAll", () => {
        it("should return a list of actors", async () => {
            const mockActors = [mockActor];
            const query: ActorQueryDto = { page: 1, perPage: 12 };

            jest.spyOn(prisma.actor, "findMany").mockResolvedValue(mockActors);
            (mockPrismaService.actorReview.groupBy as jest.Mock).mockResolvedValue([
                { actorId: mockActor.id, _avg: { rating: 4.6 }, _count: { rating: 87 } },
            ]);
            jest.spyOn(prisma.actor, "count").mockResolvedValue(1);
            jest.spyOn(prisma.userActorFavorite, "findFirst").mockResolvedValue(null);

            const result = await service.findAll(query);

            expect(result).toBeDefined();
            expect(result.actors).toHaveLength(1);
            expect(result.count).toBe(1);
        });
    });

    describe("findOne", () => {
        it("should return an actor by id", async () => {
            jest.spyOn(prisma.actor, "findFirst").mockResolvedValue(mockActor);
            (mockPrismaService.actorReview.groupBy as jest.Mock).mockResolvedValue([
                { actorId: mockActor.id, _avg: { rating: 4.6 }, _count: { rating: 87 } },
            ]);
            jest.spyOn(prisma.userActorFavorite, "findFirst").mockResolvedValue(null);

            const result = await service.findOne(mockActor.id);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockActor.id);
        });

        it("should throw NotFoundException when actor is not found", async () => {
            jest.spyOn(prisma.actor, "findFirst").mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe("create", () => {
        it("should create a new actor", async () => {
            const createDto: CreateActorDto = {
                fullname: "Tom Hanks",
                description: "American actor",
                photoSrc: "http://example.com/photo.jpg",
                photoSrcProd: "http://example.com/photo-prod.jpg",
                debut: "1980",
            };

            jest.spyOn(prisma.actor, "create").mockResolvedValue(mockActor);

            const result = await service.create(createDto);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockActor.id);
        });
    });

    describe("update", () => {
        it("should update an actor", async () => {
            const updateDto: UpdateActorDto = { fullname: "Tom Cruise" };

            jest.spyOn(prisma.actor, "findFirst").mockResolvedValue(mockActor);
            jest.spyOn(prisma.actor, "update").mockResolvedValue({
                ...mockActor,
                fullname: "tom cruise",
            });

            const result = await service.update(mockActor.id, updateDto);

            expect(result).toBeDefined();
        });

        it("should throw NotFoundException when actor is not found", async () => {
            jest.spyOn(prisma.actor, "findFirst").mockResolvedValue(null);

            await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
        });
    });

    describe("remove", () => {
        it("should delete an actor", async () => {
            jest.spyOn(prisma.actor, "findFirst").mockResolvedValue(mockActor);
            jest.spyOn(prisma.actor, "delete").mockResolvedValue(mockActor);

            await service.remove(mockActor.id);

            expect(prisma.actor.delete).toHaveBeenCalled();
        });

        it("should throw NotFoundException when actor is not found", async () => {
            jest.spyOn(prisma.actor, "findFirst").mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});
