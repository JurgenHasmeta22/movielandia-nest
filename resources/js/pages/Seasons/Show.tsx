import { Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, Clock, Heart, Pencil, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '../../components/ConfirmModal';
import AppLayout from '../../layouts/AppLayout';

interface ReviewUser { id: number; userName: string }
interface Review { id: number; content: string; rating: number; user: ReviewUser }

interface EpisodeItem {
    id: number;
    title: string;
    photoSrc: string | null;
    description: string | null;
    duration: number | null;
    ratingImdb: number | null;
}

interface Season {
    id: number;
    title: string;
    photoSrc: string | null;
    trailerSrc: string | null;
    description: string | null;
    ratingImdb: number | null;
    dateAired: string | null;
    serieId: number;
    serie?: { id: number; title: string };
    episodes?: EpisodeItem[];
    ratings?: { averageRating: number; totalReviews: number };
    isBookmarked?: boolean;
    isReviewed?: boolean;
    reviews?: Review[];
}

export default function SeasonsShow({ season }: { season: Season }) {
    const { auth } = usePage<{ auth: { user: { id: number; userName: string } | null } }>().props;

    const myReview = auth.user ? (season.reviews ?? []).find(r => r.user.id === auth.user!.id) ?? null : null;

    const favForm = useForm({ itemId: season.id, type: 'seasons' });
    const reviewForm = useForm({ itemId: season.id, itemType: 'season', content: '', rating: 8 });
    const editForm = useForm({ content: myReview?.content ?? '', rating: myReview?.rating ?? 8, itemType: 'season' });
    const deleteForm = useForm({ itemId: season.id, itemType: 'season' });

    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    function handleFavToggle(e: React.FormEvent) {
        e.preventDefault();
        if (season.isBookmarked) {
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
        editForm.put(`/users/reviews/${season.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditMode(false),
        });
    }

    function confirmDelete() {
        deleteForm.delete(`/users/reviews/${season.id}`, {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
        });
    }

    const releaseYear = season.dateAired ? new Date(season.dateAired).getFullYear() : null;

    return (
        <AppLayout title={season.title}>
            <ConfirmModal
                open={showDeleteModal}
                title="Delete Review"
                message="Are you sure you want to delete your review? This cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                confirmLabel="Delete"
            />
            <div className="space-y-8">
                {/* Breadcrumb */}
                {season.serie && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href={`/series/${season.serie.id}`} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            {season.serie.title}
                        </Link>
                        <span>›</span>
                        <span className="text-gray-300">{season.title}</span>
                    </div>
                )}

                {/* Hero */}
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                        <img
                            src={season.photoSrc
                                ? (season.photoSrc.startsWith('http') ? season.photoSrc : `/images/series/${season.photoSrc}`)
                                : '/images/placeholder.jpg'}
                            alt={season.title}
                            className="w-56 rounded-2xl shadow-2xl"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h1 className="text-4xl font-bold text-white">{season.title}</h1>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                            {releaseYear && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={13} /> {releaseYear}
                                </span>
                            )}
                            {season.episodes && (
                                <span className="flex items-center gap-1.5">
                                    <Clock size={13} /> {season.episodes.length} Episodes
                                </span>
                            )}
                            {season.ratingImdb && (
                                <span className="flex items-center gap-1.5 text-yellow-400">
                                    <Star size={13} className="fill-yellow-400" /> IMDb {season.ratingImdb}
                                </span>
                            )}
                            {season.ratings && season.ratings.averageRating > 0 && (
                                <span className="flex items-center gap-1.5 text-indigo-400">
                                    <Star size={13} className="fill-indigo-400" /> User {season.ratings.averageRating.toFixed(1)}
                                    <span className="text-gray-500 text-xs">({season.ratings.totalReviews})</span>
                                </span>
                            )}
                        </div>
                        {season.description && (
                            <p className="text-gray-300 leading-relaxed max-w-2xl">{season.description}</p>
                        )}
                        {auth.user && (
                            <div className="flex gap-3 pt-2">
                                <form onSubmit={handleFavToggle}>
                                    <button
                                        type="submit"
                                        disabled={favForm.processing}
                                        className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200 disabled:opacity-60 ${
                                            season.isBookmarked
                                                ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30 hover:border-yellow-400'
                                                : 'bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 hover:from-yellow-400 hover:to-amber-300 shadow-lg shadow-yellow-500/20'
                                        }`}
                                    >
                                        <Heart size={14} className={season.isBookmarked ? 'fill-yellow-300' : ''} />
                                        {season.isBookmarked ? 'Favorited' : 'Add to Favorites'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trailer */}
                {season.trailerSrc && (
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Trailer</h2>
                        <div className="aspect-video max-w-2xl rounded-xl overflow-hidden shadow-2xl">
                            <iframe
                                src={season.trailerSrc}
                                title="Trailer"
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>
                    </section>
                )}

                {/* Episodes list */}
                {season.episodes && season.episodes.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Episodes ({season.episodes.length})</h2>
                        <div className="space-y-3">
                            {season.episodes.map((ep, idx) => (
                                <Link
                                    key={ep.id}
                                    href={`/episodes/${ep.id}`}
                                    className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-700 hover:border-indigo-500 rounded-xl transition-colors"
                                >
                                    <span className="text-gray-500 font-mono w-8 text-right flex-shrink-0">{idx + 1}</span>
                                    <img
                                        src={ep.photoSrc
                                            ? (ep.photoSrc.startsWith('http') ? ep.photoSrc : `/images/series/${ep.photoSrc}`)
                                            : '/images/placeholder.jpg'}
                                        alt={ep.title}
                                        className="w-24 h-14 object-cover rounded-lg flex-shrink-0"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{ep.title}</p>
                                        {ep.description && (
                                            <p className="text-gray-400 text-sm line-clamp-1 mt-0.5">{ep.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0 text-sm text-gray-400">
                                        {ep.duration && <span>{ep.duration} min</span>}
                                        {ep.ratingImdb && (
                                            <span className="flex items-center gap-1 text-yellow-400">
                                                <Star size={11} className="fill-yellow-400" /> {ep.ratingImdb}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Reviews */}
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
                                            onClick={() => { editForm.setData('content', myReview.content); editForm.setData('rating', myReview.rating); setEditMode(true); }}
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
                    {(season.reviews ?? []).length === 0 ? (
                        <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {(season.reviews ?? []).slice(0, 10).map((review) => (
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
