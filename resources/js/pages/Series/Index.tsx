import { Link, router } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface Serie {
    id: number;
    title: string;
    photoSrc: string | null;
    ratingImdb: number | null;
    releaseYear: number | null;
    numSeasons: number | null;
}

interface Pagination { total: number; page: number; totalPages: number; perPage: number; }

interface Filters {
    sortBy?: string;
    ascOrDesc?: string;
    page?: number;
    perPage?: number;
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

export default function SeriesIndex({ series, pagination, filters = {} }: { series: Serie[]; pagination: Pagination; filters?: Filters }) {
    const sortBy = filters.sortBy ?? 'title';
    const ascOrDesc = filters.ascOrDesc ?? 'asc';
    const perPage = filters.perPage ?? 12;

    function handleSort(newSortBy: string) {
        const newOrder = newSortBy === sortBy && ascOrDesc === 'asc' ? 'desc' : 'asc';
        router.get('/series', { sortBy: newSortBy, ascOrDesc: newOrder, page: 1, perPage }, { preserveScroll: false });
    }

    function handleOrder(order: string) {
        router.get('/series', { sortBy, ascOrDesc: order, page: 1, perPage }, { preserveScroll: false });
    }

    function handlePerPage(newPerPage: string) {
        router.get('/series', { sortBy, ascOrDesc, page: 1, perPage: newPerPage }, { preserveScroll: false });
    }

    const paginationUrl = (p: number) => buildUrl({ sortBy, ascOrDesc, page: p, perPage });

    return (
        <AppLayout title="Series">
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-white">Series</h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => handleSort(e.target.value)}
                            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        <div className="flex rounded-lg overflow-hidden border border-gray-600">
                            <button
                                onClick={() => handleOrder('asc')}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${
                                    ascOrDesc === 'asc' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                Asc
                            </button>
                            <button
                                onClick={() => handleOrder('desc')}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${
                                    ascOrDesc === 'desc' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                Desc
                            </button>
                        </div>
                        <select
                            value={perPage}
                            onChange={(e) => handlePerPage(e.target.value)}
                            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                        >
                            {[12, 24, 48].map((n) => (
                                <option key={n} value={n}>{n} per page</option>
                            ))}
                        </select>
                    </div>
                </div>

                {pagination?.total > 0 && (
                    <p className="text-gray-400 text-sm">{pagination.total.toLocaleString()} series found</p>
                )}

                {series.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No series found.</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {series.map((s) => (
                            <Link key={s.id} href={`/series/${s.id}`} className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors">
                                <div className="aspect-[2/3] bg-gray-800 overflow-hidden">
                                    <img
                                        src={s.photoSrc ? `/images/series/${s.photoSrc}` : '/images/placeholder.jpg'}
                                        alt={s.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="text-sm font-medium text-white truncate">{s.title}</h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-gray-400">{s.releaseYear ?? '—'}</span>
                                        {s.ratingImdb && <span className="text-xs text-yellow-400 font-medium">{s.ratingImdb.toFixed(1)}</span>}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                    <div className="flex flex-wrap justify-center gap-2 pt-6">
                        {pagination.page > 1 && (
                            <Link href={paginationUrl(pagination.page - 1)}
                                className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
                                Prev
                            </Link>
                        )}
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 2)
                            .reduce<(number | 'gap')[]>((acc, p, idx, arr) => {
                                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('gap');
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, idx) =>
                                p === 'gap' ? (
                                    <span key={`gap-${idx}`} className="px-2 py-1.5 text-gray-600 text-sm">…</span>
                                ) : (
                                    <Link
                                        key={p}
                                        href={paginationUrl(p as number)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            p === pagination.page
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                    >
                                        {p}
                                    </Link>
                                )
                            )}
                        {pagination.page < pagination.totalPages && (
                            <Link href={paginationUrl(pagination.page + 1)}
                                className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
                                Next
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

