import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CreateListDto, UpdateListDto, CreateListShareDto } from "./dtos/list.dto";
import { AddListItemDto, UpdateListItemDto } from "./dtos/list-item.dto";

@Injectable()
export class ListService {
    constructor(private readonly prisma: PrismaService) {}

    async findAllByUser(userId: number) {
        return this.prisma.list.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }

    async findListById(id: number, userId?: number) {
        const list = await this.prisma.list.findUnique({
            where: { id },
            include: {
                movieItems: true,
                serieItems: true,
                seasonItems: true,
                episodeItems: true,
                actorItems: true,
                crewItems: true,
                sharedWith: true,
            },
        });

        if (!list) {
            throw new NotFoundException(`List with id ${id} not found`);
        }

        if (list.isPrivate && list.userId !== userId) {
            throw new BadRequestException("You do not have access to this list");
        }

        return list;
    }

    async createList(userId: number, createListDto: CreateListDto) {
        return this.prisma.list.create({
            data: {
                ...createListDto,
                userId,
            },
        });
    }

    async updateList(id: number, userId: number, updateListDto: UpdateListDto) {
        const list = await this.findListById(id, userId);

        if (list.userId !== userId) {
            throw new BadRequestException("You can only update your own lists");
        }

        return this.prisma.list.update({
            where: { id },
            data: updateListDto,
        });
    }

    async deleteList(id: number, userId: number) {
        const list = await this.findListById(id, userId);

        if (list.userId !== userId) {
            throw new BadRequestException("You can only delete your own lists");
        }

        return this.prisma.list.delete({
            where: { id },
        });
    }

    async addMovieToList(listId: number, userId: number, addListItemDto: AddListItemDto) {
        const list = await this.findListById(listId, userId);

        if (list.userId !== userId) {
            throw new BadRequestException("You can only add items to your own lists");
        }

        return this.prisma.listMovie.create({
            data: {
                listId,
                movieId: addListItemDto.contentId,
                userId,
                note: addListItemDto.note,
            },
        });
    }

    async addSeriesToList(listId: number, userId: number, addListItemDto: AddListItemDto) {
        const list = await this.findListById(listId, userId);

        if (list.userId !== userId) {
            throw new BadRequestException("You can only add items to your own lists");
        }

        return this.prisma.listSerie.create({
            data: {
                listId,
                serieId: addListItemDto.contentId,
                userId,
                note: addListItemDto.note,
            },
        });
    }

    async addSeasonToList(listId: number, userId: number, addListItemDto: AddListItemDto) {
        const list = await this.findListById(listId, userId);

        if (list.userId !== userId) {
            throw new BadRequestException("You can only add items to your own lists");
        }

        return this.prisma.listSeason.create({
            data: {
                listId,
                seasonId: addListItemDto.contentId,
                userId,
                note: addListItemDto.note,
            },
        });
    }

    async addEpisodeToList(listId: number, userId: number, addListItemDto: AddListItemDto) {
        const list = await this.findListById(listId, userId);

        if (list.userId !== userId) {
            throw new BadRequestException("You can only add items to your own lists");
        }

        return this.prisma.listEpisode.create({
            data: {
                listId,
                episodeId: addListItemDto.contentId,
                userId,
                note: addListItemDto.note,
            },
        });
    }

    async addActorToList(listId: number, userId: number, addListItemDto: AddListItemDto) {
        const list = await this.findListById(listId, userId);

        if (list.userId !== userId) {
            throw new BadRequestException("You can only add items to your own lists");
        }

        return this.prisma.listActor.create({
            data: {
                listId,
                actorId: addListItemDto.contentId,
                userId,
                note: addListItemDto.note,
            },
        });
    }

    async addCrewToList(listId: number, userId: number, addListItemDto: AddListItemDto) {
        const list = await this.findListById(listId, userId);

        if (list.userId !== userId) {
            throw new BadRequestException("You can only add items to your own lists");
        }

        return this.prisma.listCrew.create({
            data: {
                listId,
                crewId: addListItemDto.contentId,
                userId,
                note: addListItemDto.note,
            },
        });
    }

    async removeMovieFromList(listId: number, movieId: number, userId: number) {
        const list = await this.findListById(listId, userId);

        if (list.userId !== userId) {
            throw new BadRequestException("You can only remove items from your own lists");
        }

        return this.prisma.listMovie.deleteMany({
            where: { listId, movieId },
        });
    }

    async removeSeriesFromList(listId: number, serieId: number, userId: number) {
        const list = await this.findListById(listId, userId);

        if (list.userId !== userId) {
            throw new BadRequestException("You can only remove items from your own lists");
        }

        return this.prisma.listSerie.deleteMany({
            where: { listId, serieId },
        });
    }

    async shareList(listId: number, userId: number, createListShareDto: CreateListShareDto) {
        const list = await this.findListById(listId, userId);

        if (list.userId !== userId) {
            throw new BadRequestException("You can only share your own lists");
        }

        return this.prisma.listShare.create({
            data: {
                listId,
                userId: createListShareDto.userId,
                canEdit: createListShareDto.canEdit || false,
            },
        });
    }

    async unshareList(listId: number, userId: number, sharedUserId: number) {
        const list = await this.findListById(listId, userId);

        if (list.userId !== userId) {
            throw new BadRequestException("You can only unshare your own lists");
        }

        return this.prisma.listShare.deleteMany({
            where: { listId, userId: sharedUserId },
        });
    }

    async getSharedWithMe(userId: number) {
        return this.prisma.listShare.findMany({
            where: { userId },
            include: { list: true },
        });
    }
}
