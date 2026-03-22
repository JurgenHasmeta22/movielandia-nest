import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface Genre {
    id: number;
    name: string;
    description: string | null;
    _count?: { movies: number; series: number };
}
interface Pagination { total: number; page: number; totalPages: number }

const GENRE_COLORS = [
    'from-purple-700 to-indigo-900', 'from-pink-700 to-rose-900',
    'from-blue-700 to-cyan-900',     'from-emerald-700 to-teal-900',
    'from-orange-700 to-amber-900',  'from-red-700 to-rose-900',
    'from-violet-700 to-purple-900', 'from-sky-700 to-blue-900',
    'from-green-700 to-emerald-900', 'from-fuchsia-700 to-pink-900',
];

export default function GenresIndex({ genres, pagination }: { genres: Genre[]; pagination: Pagination }) {
    return (
        <AppLayout title="Genres">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">Genres</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {genres.map((genre, i) => (
                        <Link key={genre.id} href={`/genres/${genre.id}`}
                            className={`bg-gradient-to-br ${GENRE_COLORS[i % GENRE_COLORS.length]} rounded-xl p-5 hover:scale-105 transition-transform duration-200 block`}>
                            <h3 className="font-bold text-white capitalize">{genre.name}</h3>
                            {genre._count && (
                                <p className="text-white/70 text-xs mt-1">
                                    {genre._count.movies} movies &middot; {genre._count.series} series
                                </p>
                            )}
                            {genre.description && !genre._count && (
                                <p className="text-white/60 text-xs mt-1 line-clamp-2">{genre.description}</p>
                            )}
                        </Link>
                    ))}
                </div>
                {pagination?.totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-4">
                        {Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => i + 1).map((p) => (
                            <Link key={p} href={`/genres?page=${p}`} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${p === pagination.page ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{p}</Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
