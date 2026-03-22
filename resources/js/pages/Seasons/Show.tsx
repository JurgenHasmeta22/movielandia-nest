import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface Episode {
    id: number;
    title: string;
    episodeNumber: number;
    photoSrc?: string;
    description?: string;
}

interface Season {
    id: number;
    title: string;
    seasonNumber: number;
    photoSrc?: string;
    description?: string;
    serie?: { id: number; title: string };
    episodes?: Episode[];
    _count?: { episodes: number };
}

interface Props {
    season: Season;
}

export default function SeasonsShow({ season }: Props) {
    return (
        <AppLayout title={season.title}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex gap-8 mb-10">
                    <img
                        src={season.photoSrc
                            ? (season.photoSrc.startsWith('http') ? season.photoSrc : `/images/series/${season.photoSrc}`)
                            : '/images/placeholder.jpg'}
                        alt={season.title}
                        className="w-48 rounded-xl shadow-lg object-cover flex-shrink-0"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                    />
                    <div className="flex-1">
                        <p className="text-indigo-400 text-sm mb-1">Season {season.seasonNumber}</p>
                        <h1 className="text-4xl font-bold text-white mb-2">{season.title}</h1>
                        {season.serie && (
                            <Link href={`/series/${season.serie.id}`} className="text-indigo-400 hover:underline text-sm">
                                ← Back to {season.serie.title}
                            </Link>
                        )}
                        {season.description && (
                            <p className="text-gray-300 mt-4 leading-relaxed">{season.description}</p>
                        )}
                    </div>
                </div>

                {season.episodes && season.episodes.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Episodes ({season.episodes.length})</h2>
                        <div className="space-y-3">
                            {season.episodes.map((ep) => (
                                <Link
                                    key={ep.id}
                                    href={`/episodes/${ep.id}`}
                                    className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                                >
                                    <span className="text-gray-400 font-mono w-8 text-right">{ep.episodeNumber}</span>
                                    {ep.photoSrc && (
                                        <img src={ep.photoSrc} alt={ep.title} className="w-24 h-14 object-cover rounded" />
                                    )}
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{ep.title}</p>
                                        {ep.description && (
                                            <p className="text-gray-400 text-sm line-clamp-1 mt-1">{ep.description}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
