import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface Genre { id: number; name: string }
interface Season { id: number; title: string }

interface Serie {
    id: number;
    title: string;
    photoSrc: string | null;
    ratingImdb: number | null;
    releaseYear: number | null;
    description: string | null;
    genres: Genre[];
    seasons: Season[];
    averageRating: number | null;
}

export default function SerieShow({ serie }: { serie: Serie }) {
    return (
        <AppLayout title={serie.title}>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                        <img
                            src={serie.photoSrc
                                ? (serie.photoSrc.startsWith('http') ? serie.photoSrc : `/images/series/${serie.photoSrc}`)
                                : '/images/placeholder.jpg'}
                            alt={serie.title}
                            className="w-56 rounded-2xl shadow-2xl"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h1 className="text-4xl font-bold text-white">{serie.title}</h1>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                            {serie.releaseYear && <span>📅 {serie.releaseYear}</span>}
                            {serie.ratingImdb && <span className="text-yellow-400">⭐ IMDb {serie.ratingImdb}</span>}
                            {serie.averageRating && <span className="text-indigo-400">🌟 User {serie.averageRating.toFixed(1)}</span>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {serie.genres.map((g) => (
                                <Link key={g.id} href={`/genres/${g.id}`} className="bg-indigo-900/50 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-indigo-900 transition-colors">{g.name}</Link>
                            ))}
                        </div>
                        {serie.description && <p className="text-gray-300 leading-relaxed max-w-2xl">{serie.description}</p>}
                    </div>
                </div>

                {serie.seasons.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Seasons ({serie.seasons.length})</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {serie.seasons.map((season) => (
                                <Link key={season.id} href={`/seasons/${season.id}`}
                                    className="bg-gray-900 border border-gray-700 hover:border-indigo-500 rounded-xl p-4 text-center transition-colors">
                                    <div className="text-2xl mb-1">📂</div>
                                    <p className="text-sm font-medium text-white">{season.title}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
