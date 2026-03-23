import { Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, FolderOpen, Heart, Pencil, Star, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '../../components/ConfirmModal';
import AppLayout from '../../layouts/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Genre { id: number; name: string }
interface Season { id: number; title: string }
interface ActorCredit { id: number; fullname: string; photoSrc: string | null }
interface CrewCredit { id: number; fullname: string; photoSrc: string | null; role: string | null }
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
    actors: ActorCredit[];
    crew: CrewCredit[];
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
                        <h1 className="text-4xl font-bold text-foreground">{serie.title}</h1>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
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
                                <Link key={g.id} href={`/genres/${g.id}`}>
                                    <Badge variant="indigo">{g.name}</Badge>
                                </Link>
                            ))}
                        </div>
                        {serie.description && <p className="text-muted-foreground leading-relaxed max-w-2xl">{serie.description}</p>}
                        {auth.user && (
                            <div className="flex gap-3 pt-2">
                                <form onSubmit={handleFavToggle}>
                                    <Button
                                        type="submit"
                                        disabled={favForm.processing}
                                        variant={serie.isBookmarked ? 'outline' : 'default'}
                                        className={serie.isBookmarked ? 'border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10' : 'bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 hover:from-yellow-400 hover:to-amber-300'}
                                    >
                                        <Heart size={14} className={serie.isBookmarked ? 'fill-yellow-300' : ''} />
                                        {serie.isBookmarked ? 'Favorited' : 'Add to Favorites'}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {serie.seasons.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">Seasons ({serie.seasons.length})</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {serie.seasons.map((season) => (
                                <Link key={season.id} href={`/seasons/${season.id}`}>
                                    <Card className="border-border hover:border-primary transition-colors bg-card p-4 text-center flex flex-col items-center">
                                        <FolderOpen size={24} className="text-primary mx-auto mb-1" />
                                        <p className="text-sm font-medium text-foreground">{season.title}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {serie.actors && serie.actors.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">Cast</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-4">
                            {serie.actors.slice(0, 8).map((actor) => (
                                <Link key={actor.id} href={`/actors/${actor.id}`} className="text-center group">
                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-muted mx-auto mb-1">
                                        {actor.photoSrc ? (
                                            <img src={actor.photoSrc.startsWith('http') ? actor.photoSrc : `/images/actors/${actor.photoSrc}`} alt={actor.fullname} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground"><User size={22} /></div>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground group-hover:text-foreground truncate transition-colors">{actor.fullname}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {serie.crew && serie.crew.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">Crew</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-4">
                            {serie.crew.slice(0, 8).map((member) => (
                                <Link key={member.id} href={`/crew/${member.id}`} className="text-center group">
                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-muted mx-auto mb-1">
                                        {member.photoSrc ? (
                                            <img src={member.photoSrc.startsWith('http') ? member.photoSrc : `/images/crew/${member.photoSrc}`} alt={member.fullname} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground"><User size={22} /></div>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground group-hover:text-foreground truncate transition-colors">{member.fullname}</p>
                                    {member.role && <p className="text-xs text-primary truncate">{member.role}</p>}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

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
                                <Card className="bg-card border-border mb-6">
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

                    {(serie.reviews ?? []).length === 0 ? (
                        <p className="text-muted-foreground text-sm">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {(serie.reviews ?? []).slice(0, 5).map((review) => (
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