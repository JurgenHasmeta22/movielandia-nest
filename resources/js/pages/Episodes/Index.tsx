import { Link, router } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface Episode {
    id: number;
    title: string;
    episodeNumber: number;
    photoSrc?: string;
    description?: string;
    season?: { id: number; title: string; seasonNumber: number };
}

interface Props {
    episodes: Episode[];
    count?: number;
    filters?: Record<string, unknown>;
    searchQuery?: string;
}

export default function EpisodesIndex({ episodes, count, filters, searchQuery }: Props) {
    const page = (filters as any)?.page ?? 1;
    const perPage = (filters as any)?.perPage ?? 12;
    const totalPages = Math.ceil((count ?? 0) / perPage);

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
        router.get("/episodes/search", { title: q, page: 1, perPage });
    }

    return (
        <AppLayout title="Episodes">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-white">Episodes</h1>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            name="q"
                            defaultValue={searchQuery}
                            placeholder="Search episodes..."
                            className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500"
                        />
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Search</button>
                    </form>
                </div>

                {episodes.length === 0 ? (
                    <p className="text-gray-400 text-center py-16">No episodes found.</p>
                ) : (
                    <div className="space-y-3">
                        {episodes.map((ep) => (
                            <Link
                                key={ep.id}
                                href={`/episodes/${ep.id}`}
                                className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                            >
                                {ep.photoSrc && (
                                    <img src={ep.photoSrc} alt={ep.title} className="w-32 h-20 object-cover rounded" />
                                )}
                                <div className="flex-1">
                                    <p className="text-white font-medium">{ep.title}</p>
                                    {ep.season && (
                                        <p className="text-gray-400 text-sm">
                                            {ep.season.title} — Episode {ep.episodeNumber}
                                        </p>
                                    )}
                                    {ep.description && (
                                        <p className="text-gray-500 text-sm line-clamp-2 mt-1">{ep.description}</p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => router.get("/episodes", { ...filters, page: p })}
                                className={`px-3 py-1 rounded ${p === Number(page) ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                            >{p}</button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
