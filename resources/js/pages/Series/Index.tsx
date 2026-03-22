import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface Serie {
    id: number;
    title: string;
    photoSrc: string | null;
    ratingImdb: number | null;
    releaseYear: number | null;
    numSeasons: number | null;
}

interface Pagination { total: number; page: number; totalPages: number }

export default function SeriesIndex({ series, pagination, searchQuery }: { series: Serie[]; pagination: Pagination; searchQuery?: string }) {
    return (
        <AppLayout title="Series">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Series</h1>
                    <form action="/series/search" method="GET" className="flex gap-2">
                        <input type="text" name="title" defaultValue={searchQuery ?? ''} placeholder="Search series…"
                            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm" />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Search</button>
                    </form>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {series.map((s) => (
                        <Link key={s.id} href={`/series/${s.id}`} className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors">
                            <div className="aspect-[2/3] bg-gray-800">
                                {s.photoSrc
                                    ? <img src={`/images/series/${s.photoSrc}`} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    : <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">📺</div>
                                }
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-medium text-white truncate">{s.title}</h3>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-gray-400">{s.releaseYear ?? '—'}</span>
                                    {s.ratingImdb && <span className="text-xs text-yellow-400">⭐ {s.ratingImdb}</span>}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {pagination?.totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-6">
                        {Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => i + 1).map((p) => (
                            <Link key={p} href={`/series?page=${p}`}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${p === pagination.page ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                                {p}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
