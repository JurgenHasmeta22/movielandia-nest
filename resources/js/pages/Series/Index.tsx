import { router } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import { MediaGrid } from '../../components/MediaGrid';
import { SortControls } from '../../components/SortControls';
import { PaginationBar } from '../../components/PaginationBar';
import { CollapsibleSection } from '../../components/CollapsibleSection';
import type { Pagination, SortFilters } from '../../types/media';

interface Serie {
    id: number;
    title: string;
    photoSrc: string | null;
    ratingImdb: number | null;
    releaseYear: number | null;
    numSeasons: number | null;
}

const SORT_OPTIONS = [
    { value: 'title', label: 'Title' },
    { value: 'dateAired', label: 'Release Year' },
    { value: 'ratingImdb', label: 'IMDb Rating' },
];

function buildUrl(params: Record<string, string | number | undefined>) {
    const qs = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join('&');
    return `/series${qs ? `?${qs}` : ''}`;
}

export default function SeriesIndex({
    series,
    pagination,
    filters = {},
}: {
    series: Serie[];
    pagination: Pagination;
    filters?: SortFilters;
}) {
    const sortBy = filters.sortBy ?? 'title';
    const ascOrDesc = filters.ascOrDesc ?? 'asc';
    const perPage = filters.perPage ?? 12;

    const navigate = (overrides: Partial<SortFilters>) =>
        router.get('/series', { sortBy, ascOrDesc, page: 1, perPage, ...overrides }, { preserveScroll: false });

    return (
        <AppLayout title="Series">
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-foreground">Series</h1>
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
                    <p className="text-muted-foreground text-sm">{pagination.total.toLocaleString()} series</p>
                )}

                <CollapsibleSection title="Series" count={pagination?.total}>
                    <MediaGrid items={series} type="series" />
                    <PaginationBar
                        pagination={pagination}
                        urlBuilder={(p) => buildUrl({ sortBy, ascOrDesc, page: p, perPage })}
                    />
                </CollapsibleSection>
            </div>
        </AppLayout>
    );
}
