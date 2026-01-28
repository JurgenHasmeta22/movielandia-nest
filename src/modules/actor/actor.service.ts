import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { ActorQueryDto } from "./dtos/actor-query.dto";
import { CreateActorDto } from "./dtos/create-actor.dto";
import { UpdateActorDto } from "./dtos/update-actor.dto";
import { ActorListResponseDto, ActorDetailsDto } from "./dtos/actor-response.dto";
import { ActorMapper } from "./actor.mapper";
import { ActorParser } from "./actor.parser";
import { IActorRatingInfo } from "./actor.interface";

@Injectable()
export class ActorService {
    constructor(private prisma: PrismaService) {}

    async findAll(query: ActorQueryDto, userId?: number): Promise<ActorListResponseDto> {
        try {
            const { filters, orderByObject, skip, take } = ActorParser.parseActorQuery(query);

            const actors = await this.prisma.actor.findMany({
                where: filters,
                orderBy: orderByObject,
                skip,
                take,
            });

            const actorIds = actors.map((actor) => actor.id);
            const ratingsInfo = await this.getActorRatings(actorIds);

            const actorsWithDetails = await Promise.all(
                actors.map(async (actor) => {
                    const bookmarkInfo = userId
                        ? await this.getBookmarkStatus(actor.id, userId)
                        : { isBookmarked: false };
                    return ActorMapper.toDtoWithDetails(actor, ratingsInfo[actor.id], bookmarkInfo);
                }),
            );

            const totalCount = await this.prisma.actor.count({ where: filters });

            return ActorMapper.toListResponseDto({ actors: actorsWithDetails, count: totalCount });
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            if (error.code === "P2022" || error.code === "P2009") {
                throw new BadRequestException("Invalid query parameters");
            }

            throw error;
        }
    }

    async findOne(id: number, userId?: number): Promise<ActorDetailsDto> {
        const actor = await this.prisma.actor.findFirst({
            where: { id },
            include: {
                starredMovies: { include: { movie: true } },
                starredSeries: { include: { serie: true } },
                reviews: {
                    include: {
                        user: true,
                        upvotes: { select: { user: true } },
                        downvotes: { select: { user: true } },
                        _count: {
                            select: {
                                upvotes: true,
                                downvotes: true,
                            },
                        },
                    },
                },
            },
        });

        if (!actor) {
            throw new NotFoundException("Actor not found");
        }

        const ratingsInfo = await this.getActorRatings([actor.id]);
        const bookmarkInfo = userId ? await this.getBookmarkStatus(id, userId) : { isBookmarked: false };
        const reviewInfo = userId ? await this.getReviewStatus(id, userId) : { isReviewed: false };

        return ActorMapper.toDtoWithDetails(actor, ratingsInfo[actor.id], bookmarkInfo, reviewInfo);
    }

    async search(fullname: string, userId?: number, page: number = 1, perPage: number = 12): Promise<ActorListResponseDto> {
        const skip = (page - 1) * perPage;

        const actors = await this.prisma.actor.findMany({
            where: { fullname: { contains: fullname.toLowerCase() } },
            skip,
            take: perPage,
        });

        const actorIds = actors.map((actor) => actor.id);
        const ratingsInfo = await this.getActorRatings(actorIds);

        const actorsWithDetails = await Promise.all(
            actors.map(async (actor) => {
                const bookmarkInfo = userId
                    ? await this.getBookmarkStatus(actor.id, userId)
                    : { isBookmarked: false };
                return ActorMapper.toDtoWithDetails(actor, ratingsInfo[actor.id], bookmarkInfo);
            }),
        );

        const count = await this.prisma.actor.count({
            where: { fullname: { contains: fullname.toLowerCase() } },
        });

        return ActorMapper.toListResponseDto({ actors: actorsWithDetails, count });
    }

    async create(createActorDto: CreateActorDto): Promise<ActorDetailsDto> {
        const actor = await this.prisma.actor.create({
            data: {
                fullname: createActorDto.fullname.toLowerCase(),
                description: createActorDto.description,
                photoSrc: createActorDto.photoSrc,
                photoSrcProd: createActorDto.photoSrcProd,
                debut: createActorDto.debut,
            },
        });

        return ActorMapper.toDto(actor);
    }

    async update(id: number, updateActorDto: UpdateActorDto): Promise<ActorDetailsDto> {
        const actor = await this.prisma.actor.findFirst({
            where: { id },
        });

        if (!actor) {
            throw new NotFoundException("Actor not found");
        }

        const updatedActor = await this.prisma.actor.update({
            where: { id },
            data: {
                ...(updateActorDto.fullname && { fullname: updateActorDto.fullname.toLowerCase() }),
                ...(updateActorDto.description && { description: updateActorDto.description }),
                ...(updateActorDto.photoSrc && { photoSrc: updateActorDto.photoSrc }),
                ...(updateActorDto.photoSrcProd && { photoSrcProd: updateActorDto.photoSrcProd }),
                ...(updateActorDto.debut && { debut: updateActorDto.debut }),
            },
        });

        return ActorMapper.toDto(updatedActor);
    }

    async remove(id: number): Promise<void> {
        const actor = await this.prisma.actor.findFirst({
            where: { id },
        });

        if (!actor) {
            throw new NotFoundException("Actor not found");
        }

        await this.prisma.actor.delete({
            where: { id },
        });
    }

    async count(): Promise<number> {
        return this.prisma.actor.count();
    }

    private async getActorRatings(actorIds: number[]): Promise<{ [key: number]: IActorRatingInfo }> {
        const actorRatings = await this.prisma.actorReview.groupBy({
            by: ["actorId"],
            where: { actorId: { in: actorIds } },
            _avg: { rating: true },
            _count: { rating: true },
        });

        return actorRatings.reduce((acc, rating) => {
            acc[rating.actorId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };
            return acc;
        }, {});
    }

    private async getBookmarkStatus(actorId: number, userId: number) {
        const existingFavorite = await this.prisma.userActorFavorite.findFirst({
            where: {
                AND: [{ userId }, { actorId }],
            },
        });

        return { isBookmarked: !!existingFavorite };
    }

    private async getReviewStatus(actorId: number, userId: number) {
        const existingReview = await this.prisma.actorReview.findFirst({
            where: {
                AND: [{ userId }, { actorId }],
            },
        });

        return { isReviewed: !!existingReview };
    }
}
