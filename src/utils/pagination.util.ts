export interface PaginationParams {
    page?: number;
    limit?: number;
    orderBy?: string;
    order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export function getPaginationParams(params: PaginationParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, params.limit || DEFAULT_PAGE_SIZE));
    const skip = (page - 1) * limit;

    return {
        skip,
        take: limit,
        page,
    };
}

export function createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
): PaginatedResponse<T> {
    const lastPage = Math.ceil(total / limit);

    return {
        data,
        meta: {
            total,
            page,
            lastPage,
            hasNextPage: page < lastPage,
            hasPreviousPage: page > 1,
        },
    };
}
