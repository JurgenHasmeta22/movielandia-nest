import { Link, useForm } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";

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
                    <Link href="/lists" className="text-primary hover:underline text-sm">← My Lists</Link>
                    <div className="flex items-start justify-between mt-2">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">{list.name}</h1>
                            {list.description && (
                                <p className="text-foreground/80 mt-2">{list.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${list.isPublic ? "bg-green-900/50 text-green-300" : "bg-muted text-muted-foreground"}`}>
                                    {list.isPublic ? "Public" : "Private"}
                                </span>
                                {list._count && (
                                    <span className="text-muted-foreground text-sm">{list._count.items} items</span>
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
                                    <Card className="overflow-hidden border-border group-hover:border-primary transition-colors">
                                        <img
                                            src={subject?.photoSrc || "/images/placeholder.jpg"}
                                            alt={subject?.title || ""}
                                            className="w-full aspect-[2/3] object-cover"
                                        />
                                        <CardContent className="p-2">
                                            <p className="text-foreground text-sm font-medium truncate">{subject?.title}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-16">This list is empty. Add some movies or series!</p>
                )}
            </div>
        </AppLayout>
    );
}
