import { List, ListMovie, ListSerie, ListSeason, ListEpisode, ListActor, ListCrew, ListShare } from "@prisma/client";
import { ListDto, ListShareDto } from "./dtos/list.dto";
import { ListItemDto } from "./dtos/list-item.dto";

export class ListMapper {
    static toDto(list: List): ListDto {
        return {
            id: list.id,
            userId: list.userId,
            name: list.name,
            description: list.description,
            isPrivate: list.isPrivate,
            isArchived: list.isArchived,
            isDefault: list.isDefault,
            contentType: list.contentType as any,
            createdAt: list.createdAt,
            updatedAt: list.updatedAt,
            lastViewedAt: list.lastViewedAt,
        };
    }

    static toMovieItemDto(listMovie: ListMovie): ListItemDto {
        return {
            id: listMovie.id,
            note: listMovie.note,
            orderIndex: listMovie.orderIndex,
            addedAt: listMovie.addedAt,
        };
    }

    static toSerieItemDto(listSerie: ListSerie): ListItemDto {
        return {
            id: listSerie.id,
            note: listSerie.note,
            orderIndex: listSerie.orderIndex,
            addedAt: listSerie.addedAt,
        };
    }

    static toSeasonItemDto(listSeason: ListSeason): ListItemDto {
        return {
            id: listSeason.id,
            note: listSeason.note,
            orderIndex: listSeason.orderIndex,
            addedAt: listSeason.addedAt,
        };
    }

    static toEpisodeItemDto(listEpisode: ListEpisode): ListItemDto {
        return {
            id: listEpisode.id,
            note: listEpisode.note,
            orderIndex: listEpisode.orderIndex,
            addedAt: listEpisode.addedAt,
        };
    }

    static toActorItemDto(listActor: ListActor): ListItemDto {
        return {
            id: listActor.id,
            note: listActor.note,
            orderIndex: listActor.orderIndex,
            addedAt: listActor.addedAt,
        };
    }

    static toCrewItemDto(listCrew: ListCrew): ListItemDto {
        return {
            id: listCrew.id,
            note: listCrew.note,
            orderIndex: listCrew.orderIndex,
            addedAt: listCrew.addedAt,
        };
    }

    static toShareDto(listShare: ListShare): ListShareDto {
        return {
            id: listShare.id,
            listId: listShare.listId,
            userId: listShare.userId,
            canEdit: listShare.canEdit,
            sharedAt: listShare.sharedAt,
        };
    }
}
