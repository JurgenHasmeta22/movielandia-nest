import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../layouts/AppLayout';

interface MediaItem {
    id: number;
    title: string;
    photoSrc?: string | null;
    ratingImdb?: number | null;
    releaseYear?: number | null;
}

interface Pagination {
    total: number;
    page: number;
    totalPages: number;
    perPage: number;
}

interface Props {
    movies?: MediaItem[];
    series?: MediaItem[];
    moviesPagination?: Pagination;
    seriesPagination?: Pagination;
    searchQuery?: string;
}

function MediaCard({ item, type }: { item: MediaItem; type: 'movies' | 'series' }) {
    return (
        <Link href={`/${type}/${item.id}`} className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors">
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
                    {item.releaseYear && <span className="text-xs text-gray-400">{item.releaseYear}</span>}
                    {item.ratingImdb != null && (
                        <span className="text-xs text-yellow-400 font-medium">{item.ratingImdb.toFixed(1)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function Search({ movies = [], series = [], moviesPagination, seriesPagination, searchQuery = '' }: Props) {
    const [query, setQuery] = useState(searchQuery);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) {
            router.get('/search', { q: query.trim(), page: 1 }, { preserveScroll: false });
        }
    }

    const moviesPageUrl = (p: number) => `/search?q=${encodeURIComponent(searchQuery)}&page=${p}`;
    const seriesPageUrl = (p: number) => `/search?q=${encodeURIComponent(searchQuery)}&page=${p}`;

    const hasResults = movies.length > 0 || series.length > 0;
    const hasSearched = searchQuery.trim().length > 0;

    return (
        <AppLayout title="Search">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Search box */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-6">Search</h1>
                    <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search movies and series..."
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-base"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {hasSearched && !hasResults && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl mb-2">No results found</p>
                        <p className="text-sm">Try a different search term.</p>
                    </div>
                )}

                {/* Movies results */}
                {movies.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-white">
                                Movies
                                {moviesPagination && (
                                    <span className="text-gray-400 text-base font-normal ml-2">({moviesPagination.total.toLocaleString()} results)</span>
                                )}
                            </h2>
                            <Link href={`/movies?title=${encodeURIComponent(searchQuery)}`} className="text-sm text-indigo-400 hover:text-indigo-300">
                                View all movies
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {movies.map((m) => <MediaCard key={m.id} item={m} type="movies" />)}
                        </div>
                        {moviesPagination && moviesPagination.totalPages > 1 && (
                            <div className="flex flex-wrap justify-center gap-2 mt-6">
                                {moviesPagination.page > 1 && (
                                    <Link href={moviesPageUrl(moviesPagination.page - 1)}
                                        className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
                                        Prev
                                    </Link>
                                )}
                                {Array.from({ length: Math.min(moviesPagination.totalPages, 10) }, (_, i) => i + 1).map((p) => (
                                    <Link key={p} href={moviesPageUrl(p)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            p === moviesPagination.page ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}>{p}</Link>
                                ))}
                                {moviesPagination.page < moviesPagination.totalPages && (
                                    <Link href={moviesPageUrl(moviesPagination.page + 1)}
                                        className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* Series results */}
                {series.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-white">
                                Series
                                {seriesPagination && (
                                    <span className="text-gray-400 text-base font-normal ml-2">({seriesPagination.total.toLocaleString()} results)</span>
                                )}
                            </h2>
                            <Link href={`/series?title=${encodeURIComponent(searchQuery)}`} className="text-sm text-indigo-400 hover:text-indigo-300">
                                View all series
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {series.map((s) => <MediaCard key={s.id} item={s} type="series" />)}
                        </div>
                        {seriesPagination && seriesPagination.totalPages > 1 && (
                            <div className="flex flex-wrap justify-center gap-2 mt-6">
                                {seriesPagination.page > 1 && (
                                    <Link href={seriesPageUrl(seriesPagination.page - 1)}
                                        className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
                                        Prev
                                    </Link>
                                )}
                                {Array.from({ length: Math.min(seriesPagination.totalPages, 10) }, (_, i) => i + 1).map((p) => (
                                    <Link key={p} href={seriesPageUrl(p)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            p === seriesPagination.page ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}>{p}</Link>
                                ))}
                                {seriesPagination.page < seriesPagination.totalPages && (
                                    <Link href={seriesPageUrl(seriesPagination.page + 1)}
                                        className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
