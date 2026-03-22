import { Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface Genre { id: number; name: string }
interface Actor { id: number; fullname: string; photoSrc: string | null }
interface Review { id: number; content: string; rating: number; user: { userName: string } }

interface Movie {
    id: number;
    title: string;
    photoSrc: string | null;
    ratingImdb: number | null;
    releaseYear: number | null;
    duration: number | null;
    description: string | null;
    genres: Genre[];
    actors: Actor[];
    averageRating: number | null;
    reviews: Review[];
}

interface MovieShowProps {
    movie: Movie;
}

export default function MovieShow({ movie }: MovieShowProps) {
    const { auth } = usePage<{ auth: { user: { id: number; userName: string } | null } }>().props;

    const reviewForm = useForm({ itemId: movie.id, itemType: 'movie', content: '', rating: 8 });

    function submitReview(e: React.FormEvent) {
        e.preventDefault();
        reviewForm.post('/users/reviews');
    }

    return (
        <AppLayout title={movie.title}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                        {movie.photoSrc ? (
                            <img
                                src={`/images/movies/${movie.photoSrc}`}
                                alt={movie.title}
                                className="w-56 rounded-2xl shadow-2xl"
                            />
                        ) : (
                            <div className="w-56 aspect-[2/3] bg-gray-800 rounded-2xl flex items-center justify-center text-6xl">🎬</div>
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                            {movie.releaseYear && <span>📅 {movie.releaseYear}</span>}
                            {movie.duration && <span>⏱ {movie.duration} min</span>}
                            {movie.ratingImdb && <span className="text-yellow-400">⭐ IMDb {movie.ratingImdb}</span>}
                            {movie.averageRating && <span className="text-indigo-400">🌟 User {movie.averageRating.toFixed(1)}</span>}
                        </div>
                        {movie.genres?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {movie.genres?.map((g) => (
                                    <Link key={g.id} href={`/genres/${g.id}`} className="bg-indigo-900/50 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-indigo-900 transition-colors">
                                        {g.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                        {movie.description && (
                            <p className="text-gray-300 leading-relaxed max-w-2xl">{movie.description}</p>
                        )}

                        {auth.user && (
                            <div className="flex gap-3 pt-2">
                                <form action="/users/favorites" method="POST">
                                    <input type="hidden" name="itemId" value={movie.id} />
                                    <input type="hidden" name="type" value="movie" />
                                    <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                        ❤️ Add to Favorites
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cast */}
                {movie.actors.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Cast</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-4">
                            {movie.actors.slice(0, 8).map((actor) => (
                                <Link key={actor.id} href={`/actors/${actor.id}`} className="text-center group">
                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 mx-auto mb-1">
                                        {actor.photoSrc ? (
                                            <img src={`/images/actors/${actor.photoSrc}`} alt={actor.fullname} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 group-hover:text-white truncate transition-colors">{actor.fullname}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Reviews */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>

                    {auth.user && (
                        <form onSubmit={submitReview} className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-6 space-y-3">
                            <h3 className="font-medium text-gray-200">Write a Review</h3>
                            <textarea
                                value={reviewForm.data.content}
                                onChange={(e) => reviewForm.setData('content', e.target.value)}
                                rows={3}
                                placeholder="Share your thoughts…"
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm resize-none"
                                required
                            />
                            <div className="flex items-center gap-4">
                                <label className="text-sm text-gray-400">Rating:</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    step={0.5}
                                    value={reviewForm.data.rating}
                                    onChange={(e) => reviewForm.setData('rating', Number(e.target.value))}
                                    className="w-20 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                                />
                                <button type="submit" disabled={reviewForm.processing} className="ml-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                    Submit
                                </button>
                            </div>
                        </form>
                    )}

                    {movie.reviews.length === 0 ? (
                        <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {movie.reviews.slice(0, 5).map((review) => (
                                <div key={review.id} className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-200">{review.user.userName}</span>
                                        <span className="text-yellow-400 text-sm font-medium">⭐ {review.rating}/10</span>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">{review.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
