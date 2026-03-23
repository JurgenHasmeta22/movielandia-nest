import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";
import { Card, CardContent } from '../../components/ui/card';

interface Movie {
    id: number;
    title: string;
    photoSrc?: string;
    releaseYear?: number;
    averageRating?: number;
}

interface Props {
    movies: Movie[];
}

export default function MoviesLatest({ movies }: Props) {
    return (
        <AppLayout title="Latest Movies">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-6">Latest Movies</h1>
                {movies.length === 0 ? (
                    <p className="text-muted-foreground text-center py-16">No movies yet.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {movies.map((movie) => (
                            <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
                                <Card className="overflow-hidden border-border hover:border-primary transition-colors">
                                    <img
                                        src={movie.photoSrc || "/images/placeholder.jpg"}
                                        alt={movie.title}
                                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <CardContent className="p-2">
                                        <p className="text-foreground text-sm font-medium truncate">{movie.title}</p>
                                        {movie.releaseYear && <p className="text-muted-foreground text-xs">{movie.releaseYear}</p>}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
