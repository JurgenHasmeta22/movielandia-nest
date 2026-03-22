import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface FavoriteItem {
    id: number;
    title?: string;
    fullname?: string;
    photoSrc?: string;
    type?: string;
}

interface Props {
    favorites: FavoriteItem[];
    type?: string;
}

export default function UsersFavorites({ favorites, type }: Props) {
    const label = type === "movie" ? "Movies" : type === "serie" ? "Series" : type === "actor" ? "Actors" : "All";

    const getHref = (item: FavoriteItem) => {
        if (type === "movie") return `/movies/${item.id}`;
        if (type === "serie") return `/series/${item.id}`;
        if (type === "actor") return `/actors/${item.id}`;
        return "#";
    };

    return (
        <AppLayout title="My Favorites">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-white">My Favorites — {label}</h1>
                    <div className="flex gap-2">
                        {["movie", "serie", "actor"].map((t) => (
                            <Link
                                key={t}
                                href={`/users/favorites?type=${t}`}
                                className={`px-3 py-1 rounded text-sm capitalize ${type === t ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                            >{t}s</Link>
                        ))}
                    </div>
                </div>

                {favorites.length === 0 ? (
                    <p className="text-gray-400 text-center py-16">No favorites yet.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {favorites.map((item) => (
                            <Link key={item.id} href={getHref(item)} className="group">
                                <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition">
                                    <img
                                        src={item.photoSrc || "/images/placeholder.jpg"}
                                        alt={item.title || item.fullname || ""}
                                        className="w-full aspect-[2/3] object-cover"
                                    />
                                    <div className="p-2">
                                        <p className="text-white text-sm font-medium truncate">{item.title || item.fullname}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
