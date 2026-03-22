import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

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
                <section className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950/30 p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        <div className="flex items-center gap-4 md:gap-5">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={user.userName}
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-indigo-500/50"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg';
                                    }}
                                />
                            ) : (
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-indigo-500/50 bg-indigo-500/20 text-indigo-200 text-2xl md:text-3xl font-bold flex items-center justify-center">
                                    {user.userName.slice(0, 1).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{user.userName}</h1>
                                <p className="text-gray-400 text-sm mt-1">{user.email}</p>
                                <p className="text-gray-300 mt-3 max-w-2xl leading-relaxed">
                                    {user.bio && user.bio.trim().length > 0 ? user.bio : 'No bio added yet. Share your movie taste and favorite genres.'}
                                </p>
                            </div>
                        </div>

                        <div className="lg:ml-auto">
                            <div className="flex flex-wrap gap-2">
                                <Link href="/users/favorites/list" className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm transition-colors">
                                    Favorites
                                </Link>
                                <Link href="/users/reviews/list" className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm transition-colors">
                                    Reviews
                                </Link>
                                <Link href="/users/messages/inbox" className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm transition-colors">
                                    Messages
                                </Link>
                                <Link href="/users/forum/topics" className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm transition-colors">
                                    Forum Topics
                                </Link>
                                <Link href="/lists" className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-colors">
                                    My Lists
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {statCards.map((card) => (
                        <div key={card.label} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                            <p className="text-sm text-gray-400">{card.label}</p>
                            <p className="mt-1 text-2xl font-bold text-white">{card.value}</p>
                        </div>
                    ))}
                </section>

                {isOwnProfile && (
                    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                            <Link href="/movies" className="rounded-lg border border-gray-800 bg-gray-950/60 px-4 py-3 text-gray-200 hover:border-indigo-500/60 hover:text-white transition-colors">
                                Discover Movies
                            </Link>
                            <Link href="/series" className="rounded-lg border border-gray-800 bg-gray-950/60 px-4 py-3 text-gray-200 hover:border-indigo-500/60 hover:text-white transition-colors">
                                Discover Series
                            </Link>
                            <Link href="/forum" className="rounded-lg border border-gray-800 bg-gray-950/60 px-4 py-3 text-gray-200 hover:border-indigo-500/60 hover:text-white transition-colors">
                                Visit Forum
                            </Link>
                            <Link href="/users/favorites/list?type=movies" className="rounded-lg border border-gray-800 bg-gray-950/60 px-4 py-3 text-gray-200 hover:border-indigo-500/60 hover:text-white transition-colors">
                                Movie Bookmarks
                            </Link>
                            <Link href="/users/favorites/list?type=series" className="rounded-lg border border-gray-800 bg-gray-950/60 px-4 py-3 text-gray-200 hover:border-indigo-500/60 hover:text-white transition-colors">
                                Series Bookmarks
                            </Link>
                            <Link href="/users/reviews/list" className="rounded-lg border border-gray-800 bg-gray-950/60 px-4 py-3 text-gray-200 hover:border-indigo-500/60 hover:text-white transition-colors">
                                Manage Reviews
                            </Link>
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
