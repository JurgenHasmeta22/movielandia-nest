import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface User {
    id: number;
    userName: string;
    email?: string;
    avatar?: { photoSrc: string } | null;
    createdAt?: string;
    _count?: { favorites: number; reviews: number };
}

interface Props {
    users: User[];
}

export default function UsersIndex({ users }: Props) {
    return (
        <AppLayout title="Users">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-6">Community Members</h1>

                {users.length === 0 ? (
                    <p className="text-gray-400 text-center py-16">No users found.</p>
                ) : (
                    <div className="space-y-3">
                        {users.map((user) => (
                            <Link
                                key={user.id}
                                href={`/users/${user.id}`}
                                className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                            >
                                <img
                                    src={user.avatar?.photoSrc || "/images/placeholder.jpg"}
                                    alt={user.userName}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <p className="text-white font-medium">{user.userName}</p>
                                    {user._count && (
                                        <p className="text-gray-400 text-sm">
                                            {user._count.favorites} favorites · {user._count.reviews} reviews
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
