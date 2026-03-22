import { router } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import { MediaGrid } from '../../components/MediaGrid';
import { SortControls } from '../../components/SortControls';
import { PaginationBar } from '../../components/PaginationBar';
import { CollapsibleSection } from '../../components/CollapsibleSection';
import type { Pagination, SortFilters } from '../../types/media';

interface Movie {
    id: number;
    title: string;
    photoSrc: string | null;
    ratingImdb: number | null;
    releaseYear: number | null;
    description: string | null;
}

interface MoviesIndexProps {
    movies: Movie[];
    pagination: Pagination;
    filters?: SortFilters;
}

const SORT_OPTIONS = [
    { value: 'title', label: 'Title' },
    { value: 'dateAired', label: 'Release Year' },
    { value: 'ratingImdb', label: 'IMDb Rating' },
    { value: 'duration', label: 'Duration' },
];

function buildUrl(params: Record<string, string | number | undefined>) {
    const qs = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join('&');
    return `/movies${qs ? `?${qs}` : ''}`;
}

export default function MoviesIndex({ movies, pagination, filters = {} }: MoviesIndexProps) {
    const sortBy = filters.sortBy ?? 'title';
    const ascOrDesc = filters.ascOrDesc ?? 'asc';
    const perPage = filters.perPage ?? 12;

    const navigate = (overrides: Partial<SortFilters>) =>
        router.get('/movies', { sortBy, ascOrDesc, page: 1, perPage, ...overrides }, { preserveScroll: false });

    return (
        <AppLayout title="Movies">
            <div className="space-y-6">
                {/* Header + controls */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-white">Movies</h1>
                    <SortControls
                        sortBy={sortBy}
                        ascOrDesc={ascOrDesc}
                        perPage={perPage}
                        sortOptions={SORT_OPTIONS}
                        onSortChange={(s) => navigate({ sortBy: s, ascOrDesc: s === sortBy && ascOrDesc === 'asc' ? 'desc' : 'asc' })}
                        onOrderChange={(o) => navigate({ ascOrDesc: o })}
                        onPerPageChange={(p) => navigate({ perPage: Number(p) })}
                    />
                </div>

                {pagination?.total > 0 && (
                    <p className="text-gray-400 text-sm">{pagination.total.toLocaleString()} movies</p>
                )}

                <CollapsibleSection title="Movies" count={pagination?.total}>
                    <MediaGrid items={movies} type="movies" />
                    <PaginationBar
                        pagination={pagination}
                        urlBuilder={(p) => buildUrl({ sortBy, ascOrDesc, page: p, perPage })}
                    />
                </CollapsibleSection>
            </div>
        </AppLayout>
    );
}
