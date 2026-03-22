import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

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
                            : <div className="w-24 h-24 rounded-full bg-indigo-800 flex items-center justify-center text-3xl font-bold text-indigo-200">{user.userName[0].toUpperCase()}</div>
                        }
                    </div>
                    <div className="flex-1 space-y-3">
                        <h1 className="text-3xl font-bold text-white">{user.userName}</h1>
                        {user.bio && <p className="text-gray-400">{user.bio}</p>}
                        <div className="flex gap-4 text-sm text-gray-400">
                            {user.followersCount !== undefined && <span><b className="text-white">{user.followersCount}</b> followers</span>}
                            {user.followingCount !== undefined && <span><b className="text-white">{user.followingCount}</b> following</span>}
                            {user.reviewsCount !== undefined && <span><b className="text-white">{user.reviewsCount}</b> reviews</span>}
                        </div>
                        {!isOwnProfile && (
                            <form action="/users/follow" method="POST">
                                <input type="hidden" name="followingId" value={user.id} />
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">Follow</button>
                            </form>
                        )}
                        {isOwnProfile && (
                            <div className="flex gap-3">
                                <Link href="/users/me/favorites" className="text-sm text-indigo-400 hover:text-indigo-300">My Favorites</Link>
                                <Link href="/lists" className="text-sm text-indigo-400 hover:text-indigo-300">My Lists</Link>
                                <Link href="/users/messages/inbox" className="text-sm text-indigo-400 hover:text-indigo-300">Messages</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
