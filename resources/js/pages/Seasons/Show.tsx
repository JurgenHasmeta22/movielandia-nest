import { Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, Clock, Heart, Pencil, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '../../components/ConfirmModal';
import AppLayout from '../../layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href={`/series/${season.serie.id}`} className="text-primary hover:text-primary/80 transition-colors">
                            {season.serie.title}
                        </Link>
                        <span>›</span>
                        <span className="text-foreground">{season.title}</span>
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
                        <h1 className="text-4xl font-bold text-foreground">{season.title}</h1>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
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
                                <span className="flex items-center gap-1.5 text-primary">
                                        <Star size={13} className="fill-primary" /> User {season.ratings.averageRating.toFixed(1)}
                                        <span className="text-muted-foreground/60 text-xs">({season.ratings.totalReviews})</span>
                                </span>
                            )}
                        </div>
                        {season.description && (
                            <p className="text-muted-foreground leading-relaxed max-w-2xl">{season.description}</p>
                        )}
                        {auth.user && (
                            <div className="flex gap-3 pt-2">
                                <form onSubmit={handleFavToggle}>
                                    <Button
                                        type="submit"
                                        disabled={favForm.processing}
                                        variant={season.isBookmarked ? 'outline' : 'default'}
                                        className={season.isBookmarked ? 'border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10' : 'bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 hover:from-yellow-400 hover:to-amber-300'}
                                    >
                                        <Heart size={14} className={season.isBookmarked ? 'fill-yellow-300' : ''} />
                                        {season.isBookmarked ? 'Favorited' : 'Add to Favorites'}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trailer */}
                {season.trailerSrc && (
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">Trailer</h2>
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
                        <h2 className="text-xl font-bold text-foreground mb-4">Episodes ({season.episodes.length})</h2>
                        <div className="space-y-3">
                            {season.episodes.map((ep, idx) => (
                                <Link
                                    key={ep.id}
                                    href={`/episodes/${ep.id}`}
                                    className="flex items-center gap-4 p-4 bg-card border border-border hover:border-primary rounded-xl transition-colors"
                                >
                                    <span className="text-muted-foreground font-mono w-8 text-right flex-shrink-0">{idx + 1}</span>
                                    <img
                                        src={ep.photoSrc
                                            ? (ep.photoSrc.startsWith('http') ? ep.photoSrc : `/images/series/${ep.photoSrc}`)
                                            : '/images/placeholder.jpg'}
                                        alt={ep.title}
                                        className="w-24 h-14 object-cover rounded-lg flex-shrink-0"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-foreground font-medium truncate">{ep.title}</p>
                                        {ep.description && (
                                            <p className="text-muted-foreground text-sm line-clamp-1 mt-0.5">{ep.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0 text-sm text-muted-foreground">
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
                    <h2 className="text-xl font-bold text-foreground mb-4">Reviews</h2>
                    {auth.user && (
                        <>
                            {myReview && !editMode && (
                                <Card className="bg-indigo-950/60 border-indigo-500/30 mb-6">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-primary">Your Review</span>
                                            <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                                                <Star size={12} className="fill-yellow-400" /> {myReview.rating}/10
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{myReview.content}</p>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => { editForm.setData('content', myReview.content); editForm.setData('rating', myReview.rating); setEditMode(true); }}>
                                                <Pencil size={11} /> Edit
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => setShowDeleteModal(true)} disabled={deleteForm.processing}>
                                                <Trash2 size={11} /> Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {myReview && editMode && (
                                <Card className="bg-card border-primary/40 mb-6">
                                    <CardContent className="p-5">
                                        <form onSubmit={submitEdit} className="space-y-3">
                                            <h3 className="font-medium text-foreground">Edit Your Review</h3>
                                            <Textarea value={editForm.data.content} onChange={(e) => editForm.setData('content', e.target.value)} rows={3} required />
                                            <div className="flex items-center gap-4">
                                                <Label className="text-muted-foreground">Rating:</Label>
                                                <Input type="number" min={1} max={10} step={0.5} value={editForm.data.rating} onChange={(e) => editForm.setData('rating', Number(e.target.value))} className="w-20" />
                                                <div className="ml-auto flex gap-2">
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditMode(false)}>Cancel</Button>
                                                    <Button type="submit" size="sm" disabled={editForm.processing}>Save</Button>
                                                </div>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {!myReview && (
                                <Card className="bg-card border-border mb-6">
                                    <CardContent className="p-5">
                                        <form onSubmit={submitReview} className="space-y-3">
                                            <h3 className="font-medium text-foreground">Write a Review</h3>
                                            <Textarea value={reviewForm.data.content} onChange={(e) => reviewForm.setData('content', e.target.value)} rows={3} placeholder="Share your thoughts..." required />
                                            <div className="flex items-center gap-4">
                                                <Label className="text-muted-foreground">Rating:</Label>
                                                <Input type="number" min={1} max={10} step={0.5} value={reviewForm.data.rating} onChange={(e) => reviewForm.setData('rating', Number(e.target.value))} className="w-20" />
                                                <Button type="submit" disabled={reviewForm.processing} className="ml-auto">Submit</Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                    {(season.reviews ?? []).length === 0 ? (
                        <p className="text-muted-foreground text-sm">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {(season.reviews ?? []).slice(0, 10).map((review) => (
                                <Card key={review.id} className="bg-card border-border">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-foreground">{review.user.userName}</span>
                                            <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                                                <Star size={12} className="fill-yellow-400" /> {review.rating}/10
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{review.content}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
