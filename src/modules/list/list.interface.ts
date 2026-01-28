import { List, ListMovie, ListSerie, ListSeason, ListEpisode, ListActor, ListCrew, ListShare } from "@prisma/client";

export interface IList extends List {}

export interface IListMovie extends ListMovie {}

export interface IListSerie extends ListSerie {}

export interface IListSeason extends ListSeason {}

export interface IListEpisode extends ListEpisode {}

export interface IListActor extends ListActor {}

export interface IListCrew extends ListCrew {}

export interface IListShare extends ListShare {}

export interface IListWithItems extends IList {
    movieItems?: IListMovie[];
    serieItems?: IListSerie[];
    seasonItems?: IListSeason[];
    episodeItems?: IListEpisode[];
    actorItems?: IListActor[];
    crewItems?: IListCrew[];
    sharedWith?: IListShare[];
}
