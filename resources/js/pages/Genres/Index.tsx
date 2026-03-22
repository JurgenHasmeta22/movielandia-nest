import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface Genre { id: number; name: string; description: string | null }
interface Pagination { total: number; page: number; totalPages: number }

export default function GenresIndex({ genres, pagination }: { genres: Genre[]; pagination: Pagination }) {
    return (
        <AppLayout title="Genres">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">Genres</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {genres.map((genre) => (
                        <Link key={genre.id} href={`/genres/${genre.id}`}
                            className="bg-gray-900 border border-gray-700 hover:border-indigo-500 rounded-xl p-5 transition-colors group">
                            <div className="text-2xl mb-2">🏷️</div>
                            <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{genre.name}</h3>
                            {genre.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{genre.description}</p>}
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
