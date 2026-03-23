import { Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, Clock, Heart, Pencil, Star, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '../../components/ConfirmModal';
import AppLayout from '../../layouts/AppLayout';

interface Genre { id: number; name: string }
interface ActorCredit { id: number; fullname: string; photoSrc: string | null }
interface ReviewUser { id: number; userName: string }
interface Review { id: number; content: string; rating: number; user: ReviewUser }

interface Movie {
    id: number;
    title: string;
    photoSrc: string | null;
    ratingImdb: number | null;
    releaseYear: number | null;
    duration: number | null;
    description: string | null;
    genres: Genre[];
    actors: ActorCredit[];
    averageRating: number | null;
    reviews: Review[];
    isBookmarked?: boolean;
    isReviewed?: boolean;
}

interface MovieShowProps {
    movie: Movie;
}

export default function MovieShow({ movie }: MovieShowProps) {
    const { auth } = usePage<{ auth: { user: { id: number; userName: string } | null } }>().props;

    const myReview = auth.user ? (movie.reviews ?? []).find(r => r.user.id === auth.user!.id) ?? null : null;

    const reviewForm = useForm({ itemId: movie.id, itemType: 'movie', content: '', rating: 8 });
    const editForm = useForm({ content: myReview?.content ?? '', rating: myReview?.rating ?? 8, itemType: 'movie' });
    const deleteForm = useForm({ itemId: movie.id, itemType: 'movie' });
    const favForm = useForm({ itemId: movie.id, type: 'movies' });

    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    function submitReview(e: React.FormEvent) {
        e.preventDefault();
        reviewForm.post('/users/reviews', { preserveScroll: true });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        editForm.put(`/users/reviews/${movie.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditMode(false),
        });
    }

    function confirmDelete() {
        deleteForm.delete(`/users/reviews/${movie.id}`, {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
        });
    }

    function handleFavToggle(e: React.FormEvent) {
        e.preventDefault();
        if (movie.isBookmarked) {
            favForm.delete('/users/favorites', { preserveScroll: true });
        } else {
            favForm.post('/users/favorites', { preserveScroll: true });
        }
    }

    return (
        <AppLayout title={movie.title}>
            <ConfirmModal
                open={showDeleteModal}
                title="Delete Review"
                message="Are you sure you want to delete your review? This cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                confirmLabel="Delete"
            />
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                        <img
                            src={movie.photoSrc
                                ? (movie.photoSrc.startsWith('http') ? movie.photoSrc : `/images/movies/${movie.photoSrc}`)
                                : '/images/placeholder.jpg'}
                            alt={movie.title}
                            className="w-56 rounded-2xl shadow-2xl"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                            {movie.releaseYear && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={13} /> {movie.releaseYear}
                                </span>
                            )}
                            {movie.duration && (
                                <span className="flex items-center gap-1.5">
                                    <Clock size={13} /> {movie.duration} min
                                </span>
                            )}
                            {movie.ratingImdb && (
                                <span className="flex items-center gap-1.5 text-yellow-400">
                                    <Star size={13} className="fill-yellow-400" /> IMDb {movie.ratingImdb}
                                </span>
                            )}
                            {movie.averageRating && (
                                <span className="flex items-center gap-1.5 text-indigo-400">
                                    <Star size={13} className="fill-indigo-400" /> User {movie.averageRating.toFixed(1)}
                                </span>
                            )}
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
                                <form onSubmit={handleFavToggle}>
                                    <button
                                        type="submit"
                                        disabled={favForm.processing}
                                        className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200 disabled:opacity-60 ${
                                            movie.isBookmarked
                                                ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30 hover:border-yellow-400'
                                                : 'bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 hover:from-yellow-400 hover:to-amber-300 shadow-lg shadow-yellow-500/20'
                                        }`}
                                    >
                                        <Heart size={14} className={movie.isBookmarked ? 'fill-yellow-300' : ''} />
                                        {movie.isBookmarked ? 'Favorited' : 'Add to Favorites'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

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
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <User size={22} />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 group-hover:text-white truncate transition-colors">{actor.fullname}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>
                    {auth.user && (
                        <>
                            {myReview && !editMode && (
                                <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-xl p-5 mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-indigo-300">Your Review</span>
                                        <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                                            <Star size={12} className="fill-yellow-400" /> {myReview.rating}/10
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{myReview.content}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                editForm.setData('content', myReview.content);
                                                editForm.setData('rating', myReview.rating);
                                                setEditMode(true);
                                            }}
                                            className="inline-flex items-center gap-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <Pencil size={11} /> Edit
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            disabled={deleteForm.processing}
                                            className="inline-flex items-center gap-1.5 text-xs bg-red-900/40 hover:bg-red-900/70 text-red-300 border border-red-700/40 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                                        >
                                            <Trash2 size={11} /> Delete
                                        </button>
                                    </div>
                                </div>
                            )}

                            {myReview && editMode && (
                                <form onSubmit={submitEdit} className="bg-gray-900 border border-indigo-600/40 rounded-xl p-5 mb-6 space-y-3">
                                    <h3 className="font-medium text-gray-200">Edit Your Review</h3>
                                    <textarea
                                        value={editForm.data.content}
                                        onChange={(e) => editForm.setData('content', e.target.value)}
                                        rows={3}
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm resize-none"
                                        required
                                    />
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm text-gray-400">Rating:</label>
                                        <input
                                            type="number" min={1} max={10} step={0.5}
                                            value={editForm.data.rating}
                                            onChange={(e) => editForm.setData('rating', Number(e.target.value))}
                                            className="w-20 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                                        />
                                        <div className="ml-auto flex gap-2">
                                            <button type="button" onClick={() => setEditMode(false)} className="text-sm text-gray-400 hover:text-gray-200 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                                            <button type="submit" disabled={editForm.processing} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">Save</button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {!myReview && (
                                <form onSubmit={submitReview} className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-6 space-y-3">
                                    <h3 className="font-medium text-gray-200">Write a Review</h3>
                                    <textarea
                                        value={reviewForm.data.content}
                                        onChange={(e) => reviewForm.setData('content', e.target.value)}
                                        rows={3}
                                        placeholder="Share your thoughts..."
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm resize-none"
                                        required
                                    />
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm text-gray-400">Rating:</label>
                                        <input
                                            type="number" min={1} max={10} step={0.5}
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
                        </>
                    )}

                    {(movie.reviews ?? []).length === 0 ? (
                        <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {(movie.reviews ?? []).slice(0, 5).map((review) => (
                                <div key={review.id} className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-200">{review.user.userName}</span>
                                        <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                                            <Star size={12} className="fill-yellow-400" /> {review.rating}/10
                                        </span>
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