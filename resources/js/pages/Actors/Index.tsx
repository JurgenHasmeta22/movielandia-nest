import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import { SortControls } from '../../components/SortControls';
import { PaginationBar } from '../../components/PaginationBar';
import type { Pagination, SortFilters } from '../../types/media';

interface Actor { id: number; fullname: string; photoSrc: string | null; debut?: string | null }

const SORT_OPTIONS = [
    { value: 'fullname', label: 'Name' },
    { value: 'debut', label: 'Debut Year' },
];

function buildUrl(params: Record<string, string | number | undefined>) {
    const qs = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join('&');
    return `/actors${qs ? `?${qs}` : ''}`;
}

export default function ActorsIndex({
    actors,
    pagination,
    filters = {},
}: {
    actors: Actor[];
    pagination: Pagination;
    filters?: SortFilters;
}) {
    const sortBy = filters.sortBy ?? 'fullname';
    const ascOrDesc = filters.ascOrDesc ?? 'asc';
    const perPage = filters.perPage ?? 12;

    const navigate = (overrides: Partial<SortFilters>) =>
        router.get('/actors', { sortBy, ascOrDesc, page: 1, perPage, ...overrides }, { preserveScroll: false });

    return (
        <AppLayout title="Actors">
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-white">Actors</h1>
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
                    <p className="text-gray-400 text-sm">{pagination.total.toLocaleString()} actors</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-5">
                    {actors.map((actor) => (
                        <Link key={actor.id} href={`/actors/${actor.id}`} className="group text-center">
                            <div className="aspect-[3/4] bg-gray-800 rounded-xl overflow-hidden mb-2 group-hover:border-2 group-hover:border-indigo-500 transition-all">
                                <img
                                    src={actor.photoSrc
                                        ? (actor.photoSrc.startsWith('http') ? actor.photoSrc : `/images/actors/${actor.photoSrc}`)
                                        : '/images/placeholder.jpg'}
                                    alt={actor.fullname}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                />
                            </div>
                            <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">
                                {actor.fullname}
                            </h3>
                        </Link>
                    ))}
                </div>

                <PaginationBar
                    pagination={pagination}
                    urlBuilder={(p) => buildUrl({ sortBy, ascOrDesc, page: p, perPage })}
                />
            </div>
        </AppLayout>
    );
}

