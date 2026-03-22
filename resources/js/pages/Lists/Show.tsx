import { Link, useForm } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface ListItem {
    id: number;
    movie?: { id: number; title: string; photoSrc?: string };
    serie?: { id: number; title: string; photoSrc?: string };
}

interface MovieList {
    id: number;
    name: string;
    description?: string;
    isPublic?: boolean;
    createdAt?: string;
    items?: ListItem[];
    _count?: { items: number };
}

interface Props {
    list: MovieList;
}

export default function ListsShow({ list }: Props) {
    const { data: formData, setData, post, processing, reset } = useForm({ movieId: "", serieId: "" });

    return (
        <AppLayout title={list.name}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href="/lists" className="text-indigo-400 hover:underline text-sm">← My Lists</Link>
                    <div className="flex items-start justify-between mt-2">
                        <div>
                            <h1 className="text-3xl font-bold text-white">{list.name}</h1>
                            {list.description && (
                                <p className="text-gray-300 mt-2">{list.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${list.isPublic ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-400"}`}>
                                    {list.isPublic ? "Public" : "Private"}
                                </span>
                                {list._count && (
                                    <span className="text-gray-400 text-sm">{list._count.items} items</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {list.items && list.items.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {list.items.map((item) => {
                            const subject = item.movie || item.serie;
                            const href = item.movie ? `/movies/${item.movie.id}` : `/series/${item.serie!.id}`;
                            return (
                                <Link key={item.id} href={href} className="group">
                                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition">
                                        <img
                                            src={subject?.photoSrc || "/images/placeholder.jpg"}
                                            alt={subject?.title || ""}
                                            className="w-full aspect-[2/3] object-cover"
                                        />
                                        <div className="p-2">
                                            <p className="text-white text-sm font-medium truncate">{subject?.title}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-16">This list is empty. Add some movies or series!</p>
                )}
            </div>
        </AppLayout>
    );
}
