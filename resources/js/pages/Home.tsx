/// <reference types="vite/client" />
import { Link } from "@inertiajs/react";
import AppLayout from "../layouts/AppLayout";
import { MediaCarousel } from "../components/MediaCarousel";
import type { MediaItem } from "../types/media";

interface Genre {
    id: number;
    name: string;
    _count?: { movies: number; series: number };
}

interface Props {
    latestMovies: MediaItem[];
    latestSeries: MediaItem[];
    genres: Genre[];
}

const GENRE_COLORS = [
    "from-purple-700 to-indigo-900", "from-pink-700 to-rose-900",
    "from-blue-700 to-cyan-900",     "from-emerald-700 to-teal-900",
    "from-orange-700 to-amber-900",  "from-red-700 to-rose-900",
    "from-violet-700 to-purple-900", "from-sky-700 to-blue-900",
    "from-green-700 to-emerald-900", "from-fuchsia-700 to-pink-900",
];

export default function Home({ latestMovies, latestSeries, genres }: Props) {
    return (
        <AppLayout title="Home">
            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-950 border-b border-white/5 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 mb-12">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
                    <p className="text-indigo-400 font-semibold tracking-widest uppercase text-sm mb-4">Your Streaming Universe</p>
                    <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Discover{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Movies</span>
                        {" & "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Series</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                        Track what you&#39;ve watched, rate your favourites, join the community forum and build your perfect watchlists.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/movies" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-900/40">Browse Movies</Link>
                        <Link href="/series" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition backdrop-blur-sm">Browse Series</Link>
                        <Link href="/search" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition backdrop-blur-sm">Search</Link>
                    </div>
                </div>
            </div>

            {/* Carousels */}
            <MediaCarousel items={latestMovies} type="movies" title="Latest Movies" viewAllHref="/movies" />
            <MediaCarousel items={latestSeries} type="series" title="Latest Series" viewAllHref="/series" />

            {/* Genres grid */}
            {genres.length > 0 && (
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-2xl font-bold text-white">Browse by Genre</h2>
                        <Link href="/genres" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">All genres</Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {genres.map((g, i) => (
                            <Link key={g.id} href={`/genres/${g.id}`}>
                                <div className={`bg-gradient-to-br ${GENRE_COLORS[i % GENRE_COLORS.length]} rounded-xl p-5 hover:scale-105 transition-transform duration-200`}>
                                    <p className="text-white font-bold capitalize">{g.name}</p>
                                    {g._count && (
                                        <p className="text-white/60 text-xs mt-1">
                                            {g._count.movies} movies &middot; {g._count.series} series
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="rounded-2xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-10 text-center">
                <h2 className="text-3xl font-bold text-white mb-3">Join the Community</h2>
                <p className="text-gray-400 max-w-xl mx-auto mb-6">Discuss your favourite films, rate episodes and share lists with other movie enthusiasts.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/forum" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition">Go to Forum</Link>
                    <Link href="/register" className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition">Create Account</Link>
                </div>
            </section>
        </AppLayout>
    );
}
