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

interface Episode {
    id: number;
    title: string;
    photoSrc: string | null;
    trailerSrc: string | null;
    description: string | null;
    duration: number | null;
    ratingImdb: number | null;
    dateAired: string | null;
    seasonId: number;
    season?: {
        id: number;
        title: string;
        serie?: { id: number; title: string };
    };
    ratings?: { averageRating: number; totalReviews: number };
    isBookmarked?: boolean;
    isReviewed?: boolean;
    reviews?: Review[];
}

export default function EpisodesShow({ episode }: { episode: Episode }) {
    const { auth } = usePage<{ auth: { user: { id: number; userName: string } | null } }>().props;

    const myReview = auth.user ? (episode.reviews ?? []).find(r => r.user.id === auth.user!.id) ?? null : null;

    const favForm = useForm({ itemId: episode.id, type: 'episodes' });
    const reviewForm = useForm({ itemId: episode.id, itemType: 'episode', content: '', rating: 8 });
    const editForm = useForm({ content: myReview?.content ?? '', rating: myReview?.rating ?? 8, itemType: 'episode' });
    const deleteForm = useForm({ itemId: episode.id, itemType: 'episode' });

    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    function handleFavToggle(e: React.FormEvent) {
        e.preventDefault();
        if (episode.isBookmarked) {
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
        editForm.put(`/users/reviews/${episode.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditMode(false),
        });
    }

    function confirmDelete() {
        deleteForm.delete(`/users/reviews/${episode.id}`, {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
        });
    }

    const releaseYear = episode.dateAired ? new Date(episode.dateAired).getFullYear() : null;

    return (
        <AppLayout title={episode.title}>
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
                {(episode.season?.serie || episode.season) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {episode.season?.serie && (
                            <>
                                <Link href={`/series/${episode.season.serie.id}`} className="text-primary hover:text-primary/80 transition-colors">
                                    {episode.season.serie.title}
                                </Link>
                                <span>â€º</span>
                            </>
                        )}
                        {episode.season && (
                            <>
                                <Link href={`/seasons/${episode.season.id}`} className="text-primary hover:text-primary/80 transition-colors">
                                    {episode.season.title}
                                </Link>
                                <span>â€º</span>
                            </>
                        )}
                        <span className="text-foreground">{episode.title}</span>
                    </div>
                )}

                {/* Hero */}
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                        <img
                            src={episode.photoSrc
                                ? (episode.photoSrc.startsWith('http') ? episode.photoSrc : `/images/series/${episode.photoSrc}`)
                                : '/images/placeholder.jpg'}
                            alt={episode.title}
                            className="w-56 rounded-2xl shadow-2xl"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h1 className="text-4xl font-bold text-foreground">{episode.title}</h1>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            {releaseYear && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={13} /> {releaseYear}
                                </span>
                            )}
                            {episode.duration && (
                                <span className="flex items-center gap-1.5">
                                    <Clock size={13} /> {episode.duration} min
                                </span>
                            )}
                            {episode.ratingImdb && (
                                <span className="flex items-center gap-1.5 text-yellow-400">
                                    <Star size={13} className="fill-yellow-400" /> IMDb {episode.ratingImdb}
                                </span>
                            )}
                            {episode.ratings && episode.ratings.averageRating > 0 && (
                                <span className="flex items-center gap-1.5 text-primary">
                                    <Star size={13} className="fill-primary" /> User {episode.ratings.averageRating.toFixed(1)}
                                    <span className="text-muted-foreground/60 text-xs">({episode.ratings.totalReviews})</span>
                                </span>
                            )}
                        </div>
                        {episode.description && (
                            <p className="text-muted-foreground leading-relaxed max-w-2xl">{episode.description}</p>
                        )}
                        {auth.user && (
                            <div className="flex gap-3 pt-2">
                                <form onSubmit={handleFavToggle}>
                                    <Button
                                        type="submit"
                                        disabled={favForm.processing}
                                        variant={episode.isBookmarked ? 'outline' : 'default'}
                                        className={episode.isBookmarked ? 'border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10' : 'bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 hover:from-yellow-400 hover:to-amber-300'}
                                    >
                                        <Heart size={14} className={episode.isBookmarked ? 'fill-yellow-300' : ''} />
                                        {episode.isBookmarked ? 'Favorited' : 'Add to Favorites'}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trailer */}
                {episode.trailerSrc && (
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">Trailer</h2>
                        <div className="aspect-video max-w-2xl rounded-xl overflow-hidden shadow-2xl">
                            <iframe
                                src={episode.trailerSrc}
                                title="Trailer"
                                className="w-full h-full"
                                allowFullScreen
                            />
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
                    {(episode.reviews ?? []).length === 0 ? (
                        <p className="text-muted-foreground text-sm">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {(episode.reviews ?? []).slice(0, 10).map((review) => (
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
