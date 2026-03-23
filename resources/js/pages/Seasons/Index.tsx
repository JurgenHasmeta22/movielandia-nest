import { Link, router } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Season {
    id: number;
    title: string;
    photoSrc?: string;
    seasonNumber: number;
    serie?: { id: number; title: string };
}

interface Props {
    seasons: Season[];
    count?: number;
    filters?: Record<string, unknown>;
    searchQuery?: string;
}

export default function SeasonsIndex({ seasons, count, filters, searchQuery }: Props) {
    const page = (filters as any)?.page ?? 1;
    const perPage = (filters as any)?.perPage ?? 12;
    const totalPages = Math.ceil((count ?? 0) / perPage);

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
        router.get("/seasons/search", { title: q, page: 1, perPage });
    }

    return (
        <AppLayout title="Seasons">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Seasons</h1>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            name="q"
                            defaultValue={searchQuery}
                            placeholder="Search seasons..."
                        />
                        <Button type="submit">Search</Button>
                    </form>
                </div>

                {seasons.length === 0 ? (
                    <p className="text-muted-foreground text-center py-16">No seasons found.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {seasons.map((season) => (
                            <Link key={season.id} href={`/seasons/${season.id}`} className="group block">
                                <Card className="overflow-hidden border-border hover:border-primary transition">
                                    <img
                                        src={season.photoSrc || "/images/placeholder.jpg"}
                                        alt={season.title}
                                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <CardContent className="p-2">
                                        <p className="text-foreground text-sm font-medium truncate">{season.title}</p>
                                        {season.serie && (
                                            <p className="text-muted-foreground text-xs truncate">{season.serie.title}</p>
                                        )}
                                        <p className="text-muted-foreground/60 text-xs">Season {season.seasonNumber}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Button
                                key={p}
                                variant={p === Number(page) ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => router.get("/seasons", { ...filters, page: p })}
                            >{p}</Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
