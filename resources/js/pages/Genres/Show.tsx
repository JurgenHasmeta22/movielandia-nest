import { Link, router } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface MediaItem {
    id: number;
    title: string;
    photoSrc?: string | null;
    releaseYear?: number | null;
    ratingImdb?: number | null;
}

interface Pagination {
    total: number;
    page: number;
    totalPages: number;
    perPage: number;
}

interface Genre {
    id: number;
    name: string;
    description?: string | null;
    movies?: MediaItem[];
    series?: MediaItem[];
    moviesPagination?: Pagination;
    seriesPagination?: Pagination;
    _count?: { movies: number; series: number };
}

interface Filters {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
}

interface Props {
    genre: Genre;
    filters?: Filters;
}

const SORT_OPTIONS = [
    { value: 'title', label: 'Title' },
    { value: 'dateAired', label: 'Release Year' },
    { value: 'ratingImdb', label: 'IMDb Rating' },
];

function buildUrl(genreId: number, params: Record<string, string | number | undefined>) {
    const qs = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join('&');
    return `/genres/${genreId}${qs ? `?${qs}` : ''}`;
}

function MediaGrid({ items, type }: { items: MediaItem[]; type: 'movies' | 'series' }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => (
                <Link key={item.id} href={`/${type}/${item.id}`} className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors">
                    <div className="aspect-[2/3] bg-gray-800 overflow-hidden">
                        <img
                            src={item.photoSrc ? `/images/${type}/${item.photoSrc}` : '/images/placeholder.jpg'}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                        />
                    </div>
                    <div className="p-3">
                        <p className="text-white text-sm font-medium truncate">{item.title}</p>
                        <div className="flex items-center justify-between mt-1">
                            {item.releaseYear && <p className="text-gray-400 text-xs">{item.releaseYear}</p>}
                            {item.ratingImdb != null && (
                                <span className="text-xs text-yellow-400 font-medium">{item.ratingImdb.toFixed(1)}</span>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default function GenresShow({ genre, filters = {} }: Props) {
    const sortBy = filters.sortBy ?? 'title';
    const ascOrDesc = filters.ascOrDesc ?? 'asc';
    const perPage = filters.perPage ?? 12;

    const moviesPag = genre.moviesPagination;
    const seriesPag = genre.seriesPagination;

    function navigate(params: Record<string, string | number | undefined>) {
        router.get(`/genres/${genre.id}`, params, { preserveScroll: false });
    }

    function handleSort(newSortBy: string) {
        const newOrder = newSortBy === sortBy && ascOrDesc === 'asc' ? 'desc' : 'asc';
        navigate({ sortBy: newSortBy, ascOrDesc: newOrder, moviesPage: 1, seriesPage: 1, perPage });
    }

    function handleOrder(order: string) {
        navigate({ sortBy, ascOrDesc: order, moviesPage: 1, seriesPage: 1, perPage });
    }

    function handlePerPage(newPerPage: string) {
        navigate({ sortBy, ascOrDesc, moviesPage: 1, seriesPage: 1, perPage: newPerPage });
    }

    function handleMoviesPage(p: number) {
        navigate({ sortBy, ascOrDesc, moviesPage: p, seriesPage: seriesPag?.page ?? 1, perPage });
    }

    function handleSeriesPage(p: number) {
        navigate({ sortBy, ascOrDesc, moviesPage: moviesPag?.page ?? 1, seriesPage: p, perPage });
    }

    return (
        <AppLayout title={genre.name}>
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div>
                    <Link href="/genres" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">&larr; All Genres</Link>
                    <h1 className="text-4xl font-bold text-white mt-2 capitalize">{genre.name}</h1>
                    {genre.description && (
                        <p className="text-gray-300 mt-3 max-w-3xl">{genre.description}</p>
                    )}
                    {genre._count && (
                        <div className="flex gap-4 mt-2 text-sm text-gray-400">
                            <span>{genre._count.movies.toLocaleString()} movies</span>
                            <span>{genre._count.series.toLocaleString()} series</span>
                        </div>
                    )}
                </div>

                {/* Sort / Order controls */}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-gray-400 text-sm">Sort by:</span>
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

                {/* Movies Section */}
                {(genre.movies ?? []).length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Movies
                            {moviesPag && <span className="text-gray-400 text-base font-normal ml-2">({moviesPag.total.toLocaleString()} total)</span>}
                        </h2>
                        <MediaGrid items={genre.movies ?? []} type="movies" />
                        {moviesPag && moviesPag.totalPages > 1 && (
                            <PaginationBar
                                pagination={moviesPag}
                                onPageChange={handleMoviesPage}
                                urlBuilder={(p) => buildUrl(genre.id, { sortBy, ascOrDesc, moviesPage: p, seriesPage: seriesPag?.page ?? 1, perPage })}
                            />
                        )}
                    </section>
                )}
                {(genre.movies ?? []).length === 0 && genre._count && genre._count.movies === 0 && (
                    <p className="text-gray-500">No movies in this genre.</p>
                )}

                {/* Series Section */}
                {(genre.series ?? []).length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Series
                            {seriesPag && <span className="text-gray-400 text-base font-normal ml-2">({seriesPag.total.toLocaleString()} total)</span>}
                        </h2>
                        <MediaGrid items={genre.series ?? []} type="series" />
                        {seriesPag && seriesPag.totalPages > 1 && (
                            <PaginationBar
                                pagination={seriesPag}
                                onPageChange={handleSeriesPage}
                                urlBuilder={(p) => buildUrl(genre.id, { sortBy, ascOrDesc, moviesPage: moviesPag?.page ?? 1, seriesPage: p, perPage })}
                            />
                        )}
                    </section>
                )}
                {(genre.series ?? []).length === 0 && genre._count && genre._count.series === 0 && (
                    <p className="text-gray-500">No series in this genre.</p>
                )}
            </div>
        </AppLayout>
    );
}

function PaginationBar({
    pagination,
    onPageChange,
    urlBuilder,
}: {
    pagination: Pagination;
    onPageChange: (p: number) => void;
    urlBuilder: (p: number) => string;
}) {
    const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 2)
        .reduce<(number | 'gap')[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('gap');
            acc.push(p);
            return acc;
        }, []);

    return (
        <div className="flex flex-wrap justify-center gap-2 mt-6">
            {pagination.page > 1 && (
                <button onClick={() => onPageChange(pagination.page - 1)}
                    className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
                    Prev
                </button>
            )}
            {pages.map((p, idx) =>
                p === 'gap' ? (
                    <span key={`gap-${idx}`} className="px-2 py-1.5 text-gray-600 text-sm">&hellip;</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p as number)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            p === pagination.page
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {p}
                    </button>
                )
            )}
            {pagination.page < pagination.totalPages && (
                <button onClick={() => onPageChange(pagination.page + 1)}
                    className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
                    Next
                </button>
            )}
        </div>
    );
}

