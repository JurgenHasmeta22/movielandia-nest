import { Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, Film, Heart, MapPin, Pencil, Star, Trash2, Tv, User } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '../../components/ConfirmModal';
import AppLayout from '../../layouts/AppLayout';

interface Credit {
    id: number;
    title: string;
    photoSrc: string | null;
}

interface ReviewUser { id: number; userName: string }
interface Review { id: number; content: string; rating: number; user: ReviewUser }

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
    isBookmarked?: boolean;
    isReviewed?: boolean;
    reviews?: Review[];
}

export default function ActorShow({ actor }: { actor: Actor }) {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;
    const movies = actor.movies ?? [];
    const series = actor.series ?? [];

    const myReview = auth.user ? (actor.reviews ?? []).find(r => r.user.id === auth.user!.id) ?? null : null;

    const favForm = useForm({ itemId: actor.id, type: 'actors' });
    const reviewForm = useForm({ itemId: actor.id, itemType: 'actor', content: '', rating: 8 });
    const editForm = useForm({ content: myReview?.content ?? '', rating: myReview?.rating ?? 8, itemType: 'actor' });
    const deleteForm = useForm({ itemId: actor.id, itemType: 'actor' });

    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    function handleFavToggle(e: React.FormEvent) {
        e.preventDefault();
        if (actor.isBookmarked) {
            favForm.delete('/users/favorites', { preserveScroll: true });
        } else {
            favForm.post('/users/favorites', { preserveScroll: true });
        }
    }

    function submitReview(e: React.FormEvent) {
        e.preventDefault();
        reviewForm.post('/users/reviews', { preserveScroll: true });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        editForm.put(`/users/reviews/${actor.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditMode(false),
        });
    }

    function confirmDelete() {
        deleteForm.delete(`/users/reviews/${actor.id}`, {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
        });
    }

    const cardClass =
        'group rounded-xl border border-gray-800 bg-gray-900/60 p-2 transition hover:-translate-y-0.5 hover:border-gray-700 hover:bg-gray-900';

    return (
        <AppLayout title={actor.fullname}>
            <ConfirmModal
                open={showDeleteModal}
                title="Delete Review"
                message="Are you sure you want to delete your review? This cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                confirmLabel="Delete"
            />
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
                                {actor.birthDate && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={13} /> Born: {new Date(actor.birthDate).toLocaleDateString()}
                                    </span>
                                )}
                                {actor.birthPlace && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={13} /> {actor.birthPlace}
                                    </span>
                                )}
                                {actor.ratings && actor.ratings.totalReviews > 0 && (
                                    <span className="flex items-center gap-1.5 text-yellow-400">
                                        <Star size={13} className="fill-yellow-400" /> {actor.ratings.averageRating.toFixed(1)} ({actor.ratings.totalReviews} reviews)
                                    </span>
                                )}
                            </div>
                            {actor.description && <p className="text-gray-300 leading-relaxed max-w-3xl">{actor.description}</p>}
                            {auth.user && (
                                <div className="pt-2">
                                    <form onSubmit={handleFavToggle}>
                                        <button
                                            type="submit"
                                            disabled={favForm.processing}
                                            className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200 disabled:opacity-60 ${
                                                actor.isBookmarked
                                                    ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30 hover:border-yellow-400'
                                                    : 'bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 hover:from-yellow-400 hover:to-amber-300 shadow-lg shadow-yellow-500/20'
                                            }`}
                                        >
                                            <Heart size={14} className={actor.isBookmarked ? 'fill-yellow-300' : ''} />
                                            {actor.isBookmarked ? 'Favorited' : 'Add to Favorites'}
                                        </button>
                                    </form>
                                </div>
                            )}
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
                                            : <div className="w-full aspect-[2/3] rounded-lg bg-gray-800 flex items-center justify-center text-gray-600"><Film size={28} /></div>
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
                                            : <div className="w-full aspect-[2/3] rounded-lg bg-gray-800 flex items-center justify-center text-gray-600"><Tv size={28} /></div>
                                        }
                                        <p className="mt-2 text-xs text-gray-300 group-hover:text-white truncate transition-colors">{serie.title}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Reviews</h2>
                    {auth.user && (
                        <>
                            {myReview && !editMode && (
                                <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-indigo-300">Your Review</span>
                                        <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                                            <Star size={12} className="fill-yellow-400" /> {myReview.rating}/10
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{myReview.content}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => { editForm.setData('content', myReview.content); editForm.setData('rating', myReview.rating); setEditMode(true); }}
                                            className="inline-flex items-center gap-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                                            <Pencil size={11} /> Edit
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            disabled={deleteForm.processing}
                                            className="inline-flex items-center gap-1.5 text-xs bg-red-900/40 hover:bg-red-900/70 text-red-300 border border-red-700/40 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60">
                                            <Trash2 size={11} /> Delete
                                        </button>
                                    </div>
                                </div>
                            )}

                            {myReview && editMode && (
                                <form onSubmit={submitEdit} className="bg-gray-900 border border-indigo-600/40 rounded-xl p-5 space-y-3">
                                    <h3 className="font-medium text-gray-200">Edit Your Review</h3>
                                    <textarea value={editForm.data.content} onChange={(e) => editForm.setData('content', e.target.value)} rows={3}
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm resize-none" required />
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm text-gray-400">Rating:</label>
                                        <input type="number" min={1} max={10} step={0.5} value={editForm.data.rating} onChange={(e) => editForm.setData('rating', Number(e.target.value))}
                                            className="w-20 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500 text-sm" />
                                        <div className="ml-auto flex gap-2">
                                            <button type="button" onClick={() => setEditMode(false)} className="text-sm text-gray-400 hover:text-gray-200 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                                            <button type="submit" disabled={editForm.processing} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">Save</button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {!myReview && (
                                <form onSubmit={submitReview} className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
                                    <h3 className="font-medium text-gray-200">Write a Review</h3>
                                    <textarea value={reviewForm.data.content} onChange={(e) => reviewForm.setData('content', e.target.value)} rows={3}
                                        placeholder="Share your thoughts..."
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm resize-none" required />
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm text-gray-400">Rating:</label>
                                        <input type="number" min={1} max={10} step={0.5} value={reviewForm.data.rating} onChange={(e) => reviewForm.setData('rating', Number(e.target.value))}
                                            className="w-20 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500 text-sm" />
                                        <button type="submit" disabled={reviewForm.processing} className="ml-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}

                    {(actor.reviews ?? []).length === 0 ? (
                        <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {(actor.reviews ?? []).slice(0, 5).map((review) => (
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