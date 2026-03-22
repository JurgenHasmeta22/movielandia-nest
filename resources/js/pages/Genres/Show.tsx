import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface Movie {
    id: number;
    title: string;
    photoSrc?: string;
    releaseYear?: number;
}

interface Serie {
    id: number;
    title: string;
    photoSrc?: string;
    releaseYear?: number;
}

interface Genre {
    id: number;
    name: string;
    description?: string;
    movies?: Movie[];
    series?: Serie[];
    _count?: { movies: number; series: number };
}

interface Props {
    genre: Genre;
}

export default function GenresShow({ genre }: Props) {
    return (
        <AppLayout title={genre.name}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href="/genres" className="text-indigo-400 hover:underline text-sm">← All Genres</Link>
                    <h1 className="text-4xl font-bold text-white mt-2">{genre.name}</h1>
                    {genre.description && (
                        <p className="text-gray-300 mt-3 max-w-3xl">{genre.description}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-sm text-gray-400">
                        {genre._count && (
                            <>
                                <span>{genre._count.movies} movies</span>
                                <span>{genre._count.series} series</span>
                            </>
                        )}
                    </div>
                </div>

                {genre.movies && genre.movies.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-white mb-4">Movies</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {genre.movies.map((movie) => (
                                <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
                                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition">
                                        <img
                                            src={movie.photoSrc || "/images/placeholder.jpg"}
                                            alt={movie.title}
                                            className="w-full aspect-[2/3] object-cover"
                                        />
                                        <div className="p-2">
                                            <p className="text-white text-sm font-medium truncate">{movie.title}</p>
                                            {movie.releaseYear && <p className="text-gray-400 text-xs">{movie.releaseYear}</p>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {genre.series && genre.series.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Series</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {genre.series.map((serie) => (
                                <Link key={serie.id} href={`/series/${serie.id}`} className="group">
                                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition">
                                        <img
                                            src={serie.photoSrc || "/images/placeholder.jpg"}
                                            alt={serie.title}
                                            className="w-full aspect-[2/3] object-cover"
                                        />
                                        <div className="p-2">
                                            <p className="text-white text-sm font-medium truncate">{serie.title}</p>
                                            {serie.releaseYear && <p className="text-gray-400 text-xs">{serie.releaseYear}</p>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
