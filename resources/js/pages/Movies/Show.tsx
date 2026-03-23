import { Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, Clock, Heart, Pencil, Star, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '../../components/ConfirmModal';
import AppLayout from '../../layouts/AppLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';

interface Genre { id: number; name: string }
interface ActorCredit { id: number; fullname: string; photoSrc: string | null }
interface CrewCredit { id: number; fullname: string; photoSrc: string | null; role: string | null }
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
    crew: CrewCredit[];
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
                                    <Link key={g.id} href={`/genres/${g.id}`}>
                                        <Badge variant="indigo">{g.name}</Badge>
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
                                    <Button
                                        type="submit"
                                        disabled={favForm.processing}
                                        variant={movie.isBookmarked ? 'outline' : 'default'}
                                        className={movie.isBookmarked
                                            ? 'border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10'
                                            : 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'}
                                    >
                                        <Heart size={14} className={movie.isBookmarked ? 'fill-yellow-300' : ''} />
                                        {movie.isBookmarked ? 'Favorited' : 'Add to Favorites'}
                                    </Button>
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

                {movie.crew && movie.crew.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">Crew</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-4">
                            {movie.crew.slice(0, 8).map((member) => (
                                <Link key={member.id} href={`/crew/${member.id}`} className="text-center group">
                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 mx-auto mb-1">
                                        {member.photoSrc ? (
                                            <img src={`/images/crew/${member.photoSrc}`} alt={member.fullname} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <User size={22} />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 group-hover:text-white truncate transition-colors">{member.fullname}</p>
                                    {member.role && <p className="text-xs text-indigo-400 truncate">{member.role}</p>}
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
                                <Card className="bg-primary/5 border-primary/30 mb-6">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-primary">Your Review</span>
                                            <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                                                <Star size={12} className="fill-yellow-400" /> {myReview.rating}/10
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{myReview.content}</p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    editForm.setData('content', myReview.content);
                                                    editForm.setData('rating', myReview.rating);
                                                    setEditMode(true);
                                                }}
                                            >
                                                <Pencil size={11} /> Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => setShowDeleteModal(true)}
                                                disabled={deleteForm.processing}
                                            >
                                                <Trash2 size={11} /> Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {myReview && editMode && (
                                <Card className="border-primary/40 mb-6">
                                    <CardContent className="p-5">
                                        <form onSubmit={submitEdit} className="space-y-3">
                                            <h3 className="font-medium text-foreground">Edit Your Review</h3>
                                            <Textarea
                                                value={editForm.data.content}
                                                onChange={(e) => editForm.setData('content', e.target.value)}
                                                rows={3}
                                                required
                                            />
                                            <div className="flex items-center gap-4">
                                                <Label className="text-muted-foreground">Rating:</Label>
                                                <Input
                                                    type="number" min={1} max={10} step={1}
                                                    value={editForm.data.rating}
                                                    onChange={(e) => editForm.setData('rating', Number(e.target.value))}
                                                    className="w-20"
                                                />
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
                                <Card className="mb-6">
                                    <CardContent className="p-5">
                                        <form onSubmit={submitReview} className="space-y-3">
                                            <h3 className="font-medium text-foreground">Write a Review</h3>
                                            <Textarea
                                                value={reviewForm.data.content}
                                                onChange={(e) => reviewForm.setData('content', e.target.value)}
                                                rows={3}
                                                placeholder="Share your thoughts..."
                                                required
                                            />
                                            <div className="flex items-center gap-4">
                                                <Label className="text-muted-foreground">Rating:</Label>
                                                <Input
                                                    type="number" min={1} max={10} step={1}
                                                    value={reviewForm.data.rating}
                                                    onChange={(e) => reviewForm.setData('rating', Number(e.target.value))}
                                                    className="w-20"
                                                />
                                                <Button type="submit" size="sm" disabled={reviewForm.processing} className="ml-auto">
                                                    Submit
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}

                    {(movie.reviews ?? []).length === 0 ? (
                        <p className="text-muted-foreground text-sm">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {(movie.reviews ?? []).slice(0, 5).map((review) => (
                                <Card key={review.id}>
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