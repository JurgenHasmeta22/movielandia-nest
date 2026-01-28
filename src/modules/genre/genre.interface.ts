import { Genre as PrismaGenre } from "@prisma/client";

export interface IGenre extends PrismaGenre {}

export interface IGenreWithDetails extends IGenre {
    isBookmarked?: boolean;
}

export interface IGenreListResponse {
    genres: IGenreWithDetails[];
    count: number;
}
