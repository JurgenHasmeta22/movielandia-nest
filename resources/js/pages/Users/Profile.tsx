import { Link, router, usePage } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface User {
    id: number;
    userName: string;
    email: string;
    avatar?: { photoSrc: string } | null;
    bio?: string;
    createdAt: string;
    _count?: { favorites: number; reviews: number; followers: number; following: number };
}

interface SharedProps {
    auth: { user: { id: number } | null };
    [key: string]: unknown;
}

interface Props {
    user: User;
    isOwnProfile: boolean;
}

export default function UsersProfile({ user, isOwnProfile }: Props) {
    const { auth } = usePage<SharedProps>().props;

    return (
        <AppLayout title={`${user.userName}'s Profile`}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-gray-800 rounded-xl p-8 mb-6">
                    <div className="flex items-start gap-6">
                        <img
                            src={user.avatar?.photoSrc || "/images/placeholder.jpg"}
                            alt={user.userName}
                            className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white">{user.userName}</h1>
                            <p className="text-gray-400 text-sm mt-1">{user.email}</p>
                            {user.bio && <p className="text-gray-300 mt-3">{user.bio}</p>}
                            {user._count && (
                                <div className="flex gap-6 mt-4 text-sm text-gray-400">
                                    <span><strong className="text-white">{user._count.favorites}</strong> favorites</span>
                                    <span><strong className="text-white">{user._count.reviews}</strong> reviews</span>
                                    <span><strong className="text-white">{user._count.followers}</strong> followers</span>
                                    <span><strong className="text-white">{user._count.following}</strong> following</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <Link href="/users/favorites" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">
                        My Favorites
                    </Link>
                    <Link href="/users/reviews" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">
                        My Reviews
                    </Link>
                    <Link href="/users/messages/inbox" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">
                        Messages
                    </Link>
                    <Link href="/users/forum-topics" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">
                        Forum Topics
                    </Link>
                    <Link href="/lists" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">
                        My Lists
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
