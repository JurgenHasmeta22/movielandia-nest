import { Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, FolderOpen, Heart, Pencil, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '../../components/ConfirmModal';
import AppLayout from '../../layouts/AppLayout';

interface Genre { id: number; name: string }
interface Season { id: number; title: string }
interface ReviewUser { id: number; userName: string }
interface Review { id: number; content: string; rating: number; user: ReviewUser }

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
    isBookmarked?: boolean;
    isReviewed?: boolean;
    reviews?: Review[];
}

export default function SerieShow({ serie }: { serie: Serie }) {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;

    const myReview = auth.user ? (serie.reviews ?? []).find(r => r.user.id === auth.user!.id) ?? null : null;

    const favForm = useForm({ itemId: serie.id, type: 'series' });
    const reviewForm = useForm({ itemId: serie.id, itemType: 'serie', content: '', rating: 8 });
    const editForm = useForm({ content: myReview?.content ?? '', rating: myReview?.rating ?? 8, itemType: 'serie' });
    const deleteForm = useForm({ itemId: serie.id, itemType: 'serie' });

    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    function handleFavToggle(e: React.FormEvent) {
        e.preventDefault();
        if (serie.isBookmarked) {
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
        editForm.put(`/users/reviews/${serie.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditMode(false),
        });
    }

    function confirmDelete() {
        deleteForm.delete(`/users/reviews/${serie.id}`, {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
        });
    }

    return (
        <AppLayout title={serie.title}>
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
                            {serie.releaseYear && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={13} /> {serie.releaseYear}
                                </span>
                            )}
                            {serie.ratingImdb && (
                                <span className="flex items-center gap-1.5 text-yellow-400">
                                    <Star size={13} className="fill-yellow-400" /> IMDb {serie.ratingImdb}
                                </span>
                            )}
                            {serie.averageRating && (
                                <span className="flex items-center gap-1.5 text-indigo-400">
                                    <Star size={13} className="fill-indigo-400" /> User {serie.averageRating.toFixed(1)}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {serie.genres.map((g) => (
                                <Link key={g.id} href={`/genres/${g.id}`} className="bg-indigo-900/50 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-indigo-900 transition-colors">{g.name}</Link>
                            ))}
                        </div>
                        {serie.description && <p className="text-gray-300 leading-relaxed max-w-2xl">{serie.description}</p>}
                        {auth.user && (
                            <div className="flex gap-3 pt-2">
                                <form onSubmit={handleFavToggle}>
                                    <button
                                        type="submit"
                                        disabled={favForm.processing}
                                        className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200 disabled:opacity-60 ${
                                            serie.isBookmarked
                                                ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30 hover:border-yellow-400'
                                                : 'bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 hover:from-yellow-400 hover:to-amber-300 shadow-lg shadow-yellow-500/20'
                                        }`}
                                    >
                                        <Heart size={14} className={serie.isBookmarked ? 'fill-yellow-300' : ''} />
                                        {serie.isBookmarked ? 'Favorited' : 'Add to Favorites'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {serie.seasons.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Seasons ({serie.seasons.length})</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {serie.seasons.map((season) => (
                                <Link key={season.id} href={`/seasons/${season.id}`}
                                    className="bg-gray-900 border border-gray-700 hover:border-indigo-500 rounded-xl p-4 text-center transition-colors">
                                    <FolderOpen size={24} className="text-indigo-400 mx-auto mb-1" />
                                    <p className="text-sm font-medium text-white">{season.title}</p>
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
                                <form onSubmit={submitEdit} className="bg-gray-900 border border-indigo-600/40 rounded-xl p-5 mb-6 space-y-3">
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
                                <form onSubmit={submitReview} className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-6 space-y-3">
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

                    {(serie.reviews ?? []).length === 0 ? (
                        <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {(serie.reviews ?? []).slice(0, 5).map((review) => (
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