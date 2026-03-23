import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    userName: string;
    email: string;
    avatar: string | null;
    bio: string | null;
    createdAt: string;
    followersCount?: number;
    followingCount?: number;
    reviewsCount?: number;
}

export default function UserShow({ user, isOwnProfile }: { user: User; isOwnProfile: boolean }) {
    return (
        <AppLayout title={user.userName}>
            <div className="space-y-8 max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                        {user.avatar
                            ? <img src={user.avatar} alt={user.userName} className="w-24 h-24 rounded-full object-cover" />
                            : <div className="w-24 h-24 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-3xl font-bold text-primary">{user.userName[0].toUpperCase()}</div>
                        }
                    </div>
                    <div className="flex-1 space-y-3">
                        <h1 className="text-3xl font-bold text-foreground">{user.userName}</h1>
                        {user.bio && <p className="text-muted-foreground">{user.bio}</p>}
                        <div className="flex gap-4 text-sm text-muted-foreground">
                            {user.followersCount !== undefined && <span><b className="text-foreground">{user.followersCount}</b> followers</span>}
                            {user.followingCount !== undefined && <span><b className="text-foreground">{user.followingCount}</b> following</span>}
                            {user.reviewsCount !== undefined && <span><b className="text-foreground">{user.reviewsCount}</b> reviews</span>}
                        </div>
                        {!isOwnProfile && (
                            <form action="/users/follow" method="POST">
                                <input type="hidden" name="followingId" value={user.id} />
                                <Button type="submit">Follow</Button>
                            </form>
                        )}
                        {isOwnProfile && (
                            <div className="flex gap-3">
                                <Button variant="link" asChild><Link href="/users/me/favorites">My Favorites</Link></Button>
                                <Button variant="link" asChild><Link href="/lists">My Lists</Link></Button>
                                <Button variant="link" asChild><Link href="/users/messages/inbox">Messages</Link></Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
