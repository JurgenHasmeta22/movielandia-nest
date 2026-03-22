import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface Movie { id: number; title: string; photoSrc: string | null }

interface Actor {
    id: number;
    fullname: string;
    photoSrc: string | null;
    birthDate: string | null;
    birthPlace: string | null;
    description: string | null;
    movies: Movie[];
}

export default function ActorShow({ actor }: { actor: Actor }) {
    return (
        <AppLayout title={actor.fullname}>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                        {actor.photoSrc
                            ? <img src={`/images/actors/${actor.photoSrc}`} alt={actor.fullname} className="w-48 rounded-2xl shadow-2xl" />
                            : <div className="w-48 aspect-[3/4] bg-gray-800 rounded-2xl flex items-center justify-center text-6xl">👤</div>
                        }
                    </div>
                    <div className="flex-1 space-y-4">
                        <h1 className="text-4xl font-bold text-white">{actor.fullname}</h1>
                        <div className="text-sm text-gray-400 space-y-1">
                            {actor.birthDate && <p>🎂 Born: {new Date(actor.birthDate).toLocaleDateString()}</p>}
                            {actor.birthPlace && <p>📍 {actor.birthPlace}</p>}
                        </div>
                        {actor.description && <p className="text-gray-300 leading-relaxed max-w-2xl">{actor.description}</p>}
                    </div>
                </div>

                {actor.movies.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Filmography</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3">
                            {actor.movies.slice(0, 16).map((movie) => (
                                <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
                                    <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
                                        {movie.photoSrc
                                            ? <img src={`/images/movies/${movie.photoSrc}`} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            : <div className="w-full h-full flex items-center justify-center text-2xl text-gray-600">🎬</div>
                                        }
                                    </div>
                                    <p className="text-xs text-gray-400 group-hover:text-white mt-1 truncate transition-colors">{movie.title}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
