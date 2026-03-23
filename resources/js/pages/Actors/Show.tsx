import { Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, Film, Heart, MapPin, Pencil, Star, Trash2, Tv, User } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '../../components/ConfirmModal';
import AppLayout from '../../layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
                <Card className="bg-card border-border p-6 md:p-8">
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
                            <h1 className="text-4xl font-bold text-foreground tracking-tight">{actor.fullname}</h1>
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
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
                            {actor.description && <p className="text-muted-foreground leading-relaxed max-w-3xl">{actor.description}</p>}
                            {auth.user && (
                                <div className="pt-2">
                                    <form onSubmit={handleFavToggle}>
                                        <Button
                                            type="submit"
                                            disabled={favForm.processing}
                                            variant={actor.isBookmarked ? 'outline' : 'default'}
                                            className={actor.isBookmarked ? 'border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10' : 'bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 hover:from-yellow-400 hover:to-amber-300'}
                                        >
                                            <Heart size={14} className={actor.isBookmarked ? 'fill-yellow-300' : ''} />
                                            {actor.isBookmarked ? 'Favorited' : 'Add to Favorites'}
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-foreground">Starred Movies</h2>
                        <span className="text-sm text-muted-foreground">{movies.length} Movies</span>
                    </div>
                    {movies.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-border bg-card/40 px-4 py-6 text-center text-muted-foreground">
                            No starred movies available yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {movies.slice(0, 18).map((movie) => (
                                <Link key={movie.id} href={`/movies/${movie.id}`} className="group block">
                                    <Card className="border-border bg-card/60 p-2 transition hover:-translate-y-0.5 hover:border-border/80">
                                        {movie.photoSrc
                                            ? <img src={`/images/movies/${movie.photoSrc}`} alt={movie.title} className="w-full aspect-[2/3] rounded-lg object-cover group-hover:scale-[1.02] transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }} />
                                            : <div className="w-full aspect-[2/3] rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Film size={28} /></div>
                                        }
                                        <p className="mt-2 text-xs text-muted-foreground group-hover:text-foreground truncate transition-colors">{movie.title}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-foreground">Starred Series</h2>
                        <span className="text-sm text-muted-foreground">{series.length} Series</span>
                    </div>
                    {series.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-border bg-card/40 px-4 py-6 text-center text-muted-foreground">
                            No starred series available yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {series.slice(0, 18).map((serie) => (
                                <Link key={serie.id} href={`/series/${serie.id}`} className="group block">
                                    <Card className="border-border bg-card/60 p-2 transition hover:-translate-y-0.5 hover:border-border/80">
                                        {serie.photoSrc
                                            ? <img src={`/images/series/${serie.photoSrc}`} alt={serie.title} className="w-full aspect-[2/3] rounded-lg object-cover group-hover:scale-[1.02] transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }} />
                                            : <div className="w-full aspect-[2/3] rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Tv size={28} /></div>
                                        }
                                        <p className="mt-2 text-xs text-muted-foreground group-hover:text-foreground truncate transition-colors">{serie.title}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
                    {auth.user && (
                        <>
                            {myReview && !editMode && (
                                <Card className="bg-indigo-950/60 border-indigo-500/30">
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
                                <Card className="bg-card border-primary/40">
                                    <CardContent className="p-5">
                                        <form onSubmit={submitEdit} className="space-y-3">
                                            <h3 className="font-medium text-foreground">Edit Your Review</h3>
                                            <Textarea value={editForm.data.content} onChange={(e) => editForm.setData('content', e.target.value)} rows={3} required />
                                            <div className="flex items-center gap-4">
                                                <Label className="text-muted-foreground">Rating:</Label>
                                                <Input type="number" min={1} max={10} step={1} value={editForm.data.rating} onChange={(e) => editForm.setData('rating', Number(e.target.value))} className="w-20" />
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
                                <Card className="bg-card border-border">
                                    <CardContent className="p-5">
                                        <form onSubmit={submitReview} className="space-y-3">
                                            <h3 className="font-medium text-foreground">Write a Review</h3>
                                            <Textarea value={reviewForm.data.content} onChange={(e) => reviewForm.setData('content', e.target.value)} rows={3} placeholder="Share your thoughts..." required />
                                            <div className="flex items-center gap-4">
                                                <Label className="text-muted-foreground">Rating:</Label>
                                                <Input type="number" min={1} max={10} step={1} value={reviewForm.data.rating} onChange={(e) => reviewForm.setData('rating', Number(e.target.value))} className="w-20" />
                                                <Button type="submit" disabled={reviewForm.processing} className="ml-auto">Submit</Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}

                    {(actor.reviews ?? []).length === 0 ? (
                        <p className="text-muted-foreground text-sm">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {(actor.reviews ?? []).slice(0, 5).map((review) => (
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
