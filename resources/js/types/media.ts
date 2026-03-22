export interface MediaItem {
    id: number;
    title: string;
    photoSrc?: string | null;
    releaseYear?: number | null;
    ratingImdb?: number | null;
}

export interface Pagination {
    total: number;
    page: number;
    totalPages: number;
    perPage: number;
}

export interface SortFilters {
    sortBy?: string;
    ascOrDesc?: string;
    page?: number;
    perPage?: number;
}
