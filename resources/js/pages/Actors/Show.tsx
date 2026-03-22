import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface Credit {
    id: number;
    title: string;
    photoSrc: string | null;
}

interface Actor {
    id: number;
    fullname: string;
    photoSrc: string | null;
    birthDate: string | null;
    birthPlace: string | null;
    description: string | null;
    movies: Credit[];
    series: Credit[];
    ratings?: { averageRating: number; totalReviews: number };
}

export default function ActorShow({ actor }: { actor: Actor }) {
    const movies = actor.movies ?? [];
    const series = actor.series ?? [];

    const cardClass =
        'group rounded-xl border border-gray-800 bg-gray-900/60 p-2 transition hover:-translate-y-0.5 hover:border-gray-700 hover:bg-gray-900';

    return (
        <AppLayout title={actor.fullname}>
            <div className="space-y-10">
                <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                        <img
                            src={actor.photoSrc
                                ? (actor.photoSrc.startsWith('http') ? actor.photoSrc : `/images/actors/${actor.photoSrc}`)
                                : '/images/placeholder.jpg'}
                            alt={actor.fullname}
                            className="w-52 rounded-2xl shadow-2xl"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h1 className="text-4xl font-bold text-white tracking-tight">{actor.fullname}</h1>
                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
                            {actor.birthDate && <p>🎂 Born: {new Date(actor.birthDate).toLocaleDateString()}</p>}
                            {actor.birthPlace && <p>📍 {actor.birthPlace}</p>}
                            {actor.ratings && actor.ratings.totalReviews > 0 && (
                                <p>⭐ {actor.ratings.averageRating.toFixed(1)} ({actor.ratings.totalReviews} reviews)</p>
                            )}
                        </div>
                        {actor.description && <p className="text-gray-300 leading-relaxed max-w-3xl">{actor.description}</p>}
                    </div>
                </div>
                </div>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Movies</h2>
                        <span className="text-sm text-gray-400">{movies.length} credits</span>
                    </div>
                    {movies.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-gray-800 bg-gray-900/40 px-4 py-6 text-center text-gray-400">
                            No movie credits available yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {movies.slice(0, 18).map((movie) => (
                                <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
                                    <div className={cardClass}>
                                        {movie.photoSrc
                                            ? <img src={`/images/movies/${movie.photoSrc}`} alt={movie.title} className="w-full aspect-[2/3] rounded-lg object-cover group-hover:scale-[1.02] transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }} />
                                            : <div className="w-full aspect-[2/3] rounded-lg bg-gray-800 flex items-center justify-center text-2xl text-gray-600">🎬</div>
                                        }
                                        <p className="mt-2 text-xs text-gray-300 group-hover:text-white truncate transition-colors">{movie.title}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Series</h2>
                        <span className="text-sm text-gray-400">{series.length} credits</span>
                    </div>
                    {series.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-gray-800 bg-gray-900/40 px-4 py-6 text-center text-gray-400">
                            No series credits available yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {series.slice(0, 18).map((serie) => (
                                <Link key={serie.id} href={`/series/${serie.id}`} className="group">
                                    <div className={cardClass}>
                                        {serie.photoSrc
                                            ? <img src={`/images/series/${serie.photoSrc}`} alt={serie.title} className="w-full aspect-[2/3] rounded-lg object-cover group-hover:scale-[1.02] transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }} />
                                            : <div className="w-full aspect-[2/3] rounded-lg bg-gray-800 flex items-center justify-center text-2xl text-gray-600">📺</div>
                                        }
                                        <p className="mt-2 text-xs text-gray-300 group-hover:text-white truncate transition-colors">{serie.title}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
