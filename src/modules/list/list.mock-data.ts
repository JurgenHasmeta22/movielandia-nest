import { List } from "@prisma/client";
import { IListWithItems } from "./list.interface";

export const mockList: List = {
    id: 1,
    userId: 1,
    name: "Test List",
    description: "A test list",
    isPrivate: false,
    isArchived: false,
    isDefault: false,
    contentType: "movie" as any,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    lastViewedAt: new Date("2024-01-01"),
};

export const mockListWithItems: IListWithItems = {
    ...mockList,
    movieItems: [],
    serieItems: [],
    seasonItems: [],
    episodeItems: [],
    actorItems: [],
    crewItems: [],
    sharedWith: [],
};
