import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface User {
    id: number;
    userName: string;
    email: string;
    avatar?: string | null;
    bio?: string | null;
    followersCount: number;
    followingCount: number;
    reviewsCount: number;
    favoritesCount: number;
}

interface Props {
    user: User;
    isOwnProfile: boolean;
}

export default function UsersProfile({ user, isOwnProfile }: Props) {
    const profileImage = user.avatar
        ? (user.avatar.startsWith('http') ? user.avatar : `/images/users/${user.avatar}`)
        : null;

    const statCards = [
        { label: 'Followers', value: user.followersCount },
        { label: 'Following', value: user.followingCount },
        { label: 'Reviews', value: user.reviewsCount },
        { label: 'Bookmarks', value: user.favoritesCount },
    ];

    return (
        <AppLayout title={`${user.userName}'s Profile`}>
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-border p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        <div className="flex items-center gap-4 md:gap-5">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={user.userName}
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-primary/50"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg';
                                    }}
                                />
                            ) : (
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary/50 bg-primary/20 text-primary text-2xl md:text-3xl font-bold flex items-center justify-center">
                                    {user.userName.slice(0, 1).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{user.userName}</h1>
                                <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
                                <p className="text-foreground/80 mt-3 max-w-2xl leading-relaxed">
                                    {user.bio && user.bio.trim().length > 0 ? user.bio : 'No bio added yet. Share your movie taste and favorite genres.'}
                                </p>
                            </div>
                        </div>

                        <div className="lg:ml-auto">
                            <div className="flex flex-wrap gap-2">
                                <Button variant="secondary" size="sm" asChild><Link href="/users/favorites/list">Favorites</Link></Button>
                                <Button variant="secondary" size="sm" asChild><Link href="/users/reviews/list">Reviews</Link></Button>
                                <Button variant="secondary" size="sm" asChild><Link href="/users/messages/inbox">Messages</Link></Button>
                                <Button variant="secondary" size="sm" asChild><Link href="/users/forum/topics">Forum Topics</Link></Button>
                                <Button variant="default" size="sm" asChild><Link href="/lists">My Lists</Link></Button>
                            </div>
                        </div>
                    </div>
                </Card>

                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {statCards.map((card) => (
                        <Card key={card.label} className="border-border bg-card p-4">
                            <p className="text-sm text-muted-foreground">{card.label}</p>
                            <p className="mt-1 text-2xl font-bold text-foreground">{card.value}</p>
                        </Card>
                    ))}
                </section>

                {isOwnProfile && (
                    <Card className="border-border bg-card p-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                            <Button variant="outline" asChild className="justify-start h-auto px-4 py-3"><Link href="/movies">Discover Movies</Link></Button>
                            <Button variant="outline" asChild className="justify-start h-auto px-4 py-3"><Link href="/series">Discover Series</Link></Button>
                            <Button variant="outline" asChild className="justify-start h-auto px-4 py-3"><Link href="/forum">Visit Forum</Link></Button>
                            <Button variant="outline" asChild className="justify-start h-auto px-4 py-3"><Link href="/users/favorites/list?type=movies">Movie Bookmarks</Link></Button>
                            <Button variant="outline" asChild className="justify-start h-auto px-4 py-3"><Link href="/users/favorites/list?type=series">Series Bookmarks</Link></Button>
                            <Button variant="outline" asChild className="justify-start h-auto px-4 py-3"><Link href="/users/reviews/list">Manage Reviews</Link></Button>
                        </div>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
