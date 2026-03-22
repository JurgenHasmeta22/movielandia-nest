import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface Episode {
    id: number;
    title: string;
    episodeNumber: number;
    photoSrc?: string;
    description?: string;
    season?: {
        id: number;
        title: string;
        seasonNumber: number;
        serie?: { id: number; title: string };
    };
    _count?: { ratings: number };
    averageRating?: number;
}

interface Props {
    episode: Episode;
}

export default function EpisodesShow({ episode }: Props) {
    return (
        <AppLayout title={episode.title}>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex gap-8 mb-8">
                    <img
                        src={episode.photoSrc
                            ? (episode.photoSrc.startsWith('http') ? episode.photoSrc : `/images/series/${episode.photoSrc}`)
                            : '/images/placeholder.jpg'}
                        alt={episode.title}
                        className="w-64 rounded-xl shadow-lg object-cover flex-shrink-0"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                    />
                    <div className="flex-1">
                        {episode.season?.serie && (
                            <Link href={`/series/${episode.season.serie.id}`} className="text-indigo-400 hover:underline text-sm">
                                {episode.season.serie.title}
                            </Link>
                        )}
                        {episode.season && (
                            <span className="text-gray-500 text-sm mx-2">›</span>
                        )}
                        {episode.season && (
                            <Link href={`/seasons/${episode.season.id}`} className="text-indigo-400 hover:underline text-sm">
                                {episode.season.title}
                            </Link>
                        )}
                        <h1 className="text-4xl font-bold text-white mt-2 mb-1">
                            Episode {episode.episodeNumber}: {episode.title}
                        </h1>
                        {episode.description && (
                            <p className="text-gray-300 mt-4 leading-relaxed">{episode.description}</p>
                        )}
                        {episode.averageRating != null && (
                            <div className="flex items-center gap-2 mt-4">
                                <span className="text-yellow-400 text-xl">★</span>
                                <span className="text-white font-semibold">{episode.averageRating.toFixed(1)}</span>
                                {episode._count && (
                                    <span className="text-gray-400 text-sm">({episode._count.ratings} reviews)</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
