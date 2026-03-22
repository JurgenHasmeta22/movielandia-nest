import { Link, router } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface CrewMember {
    id: number;
    fullname: string;
    photoSrc?: string;
    role?: string;
    department?: string;
}

interface Props {
    crew: CrewMember[];
    count?: number;
    filters?: Record<string, unknown>;
    searchQuery?: string;
}

export default function CrewIndex({ crew, count, filters, searchQuery }: Props) {
    const page = (filters as any)?.page ?? 1;
    const perPage = (filters as any)?.perPage ?? 12;
    const totalPages = Math.ceil((count ?? 0) / perPage);

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
        router.get("/crew/search", { fullname: q, page: 1, perPage });
    }

    return (
        <AppLayout title="Crew">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-white">
                        Crew
                        {count != null && <span className="text-gray-400 text-lg font-normal ml-2">({count} members)</span>}
                    </h1>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            name="q"
                            defaultValue={searchQuery}
                            placeholder="Search crew..."
                            className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500"
                        />
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Search</button>
                    </form>
                </div>

                {crew.length === 0 ? (
                    <p className="text-gray-400 text-center py-16">No crew members found.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {crew.map((member) => (
                            <Link key={member.id} href={`/crew/${member.id}`} className="group">
                                <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition">
                                    <img
                                        src={member.photoSrc || "/images/placeholder.jpg"}
                                        alt={member.fullname}
                                        className="w-full aspect-square object-cover"
                                    />
                                    <div className="p-2">
                                        <p className="text-white text-sm font-medium truncate">{member.fullname}</p>
                                        {member.department && <p className="text-gray-400 text-xs truncate">{member.department}</p>}
                                    </div>
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
                                onClick={() => router.get("/crew", { ...filters, page: p })}
                                className={`px-3 py-1 rounded ${p === Number(page) ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                            >{p}</button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
