import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";

interface MovieList {
    id: number;
    name: string;
    description?: string;
    isPublic?: boolean;
    user?: { id: number; userName: string };
    _count?: { items: number };
}

interface Props {
    lists: MovieList[];
}

export default function ListsSharedWithMe({ lists }: Props) {
    return (
        <AppLayout title="Shared With Me">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-6">Lists Shared With Me</h1>

                {lists.length === 0 ? (
                    <p className="text-muted-foreground text-center py-16">No lists have been shared with you.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lists.map((list) => (
                            <Link key={list.id} href={`/lists/${list.id}`} className="group">
                                <Card className="border-border hover:border-primary transition-colors h-full">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-2">
                                            <h2 className="text-foreground font-semibold text-lg group-hover:text-primary transition-colors">{list.name}</h2>
                                        </div>
                                        {list.description && (
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{list.description}</p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            {list.user && (
                                                <span className="text-muted-foreground text-xs">by {list.user.userName}</span>
                                            )}
                                            {list._count && (
                                                <span className="text-muted-foreground text-xs">{list._count.items} items</span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
