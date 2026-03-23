import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FavoriteItem {
    id: number;
    movie?: { id: number; title: string; photoSrc?: string | null; photoSrcProd?: string | null };
    serie?: { id: number; title: string; photoSrc?: string | null; photoSrcProd?: string | null };
    actor?: { id: number; fullname: string; photoSrc?: string | null; photoSrcProd?: string | null };
    crew?: { id: number; fullname: string; photoSrc?: string | null; photoSrcProd?: string | null };
    season?: { id: number; title: string; photoSrc?: string | null; photoSrcProd?: string | null };
    episode?: { id: number; title: string; photoSrc?: string | null; photoSrcProd?: string | null };
}

interface FavoritesPayload {
    items: FavoriteItem[];
    total: number;
    page: number;
    perPage: number;
}

interface Props {
    favorites: FavoritesPayload;
    type?: string;
}

export default function UsersFavorites({ favorites, type }: Props) {
    const activeType = type ?? '';
    const items = Array.isArray(favorites) ? favorites : favorites?.items ?? [];

    const label =
        activeType === 'movies'
            ? 'Movies'
            : activeType === 'series'
            ? 'Series'
            : activeType === 'actors'
            ? 'Actors'
            : activeType === 'crew'
            ? 'Crew'
            : activeType === 'seasons'
            ? 'Seasons'
            : activeType === 'episodes'
            ? 'Episodes'
            : 'All';

    const normalize = (item: FavoriteItem) => {
        if (item.movie) {
            return {
                id: item.movie.id,
                title: item.movie.title,
                href: `/movies/${item.movie.id}`,
                image: item.movie.photoSrc || item.movie.photoSrcProd || null,
                imagePath: '/images/movies/',
            };
        }
        if (item.serie) {
            return {
                id: item.serie.id,
                title: item.serie.title,
                href: `/series/${item.serie.id}`,
                image: item.serie.photoSrc || item.serie.photoSrcProd || null,
                imagePath: '/images/series/',
            };
        }
        if (item.actor) {
            return {
                id: item.actor.id,
                title: item.actor.fullname,
                href: `/actors/${item.actor.id}`,
                image: item.actor.photoSrc || item.actor.photoSrcProd || null,
                imagePath: '/images/actors/',
            };
        }
        if (item.crew) {
            return {
                id: item.crew.id,
                title: item.crew.fullname,
                href: `/crew/${item.crew.id}`,
                image: item.crew.photoSrc || item.crew.photoSrcProd || null,
                imagePath: '/images/crew/',
            };
        }
        if (item.season) {
            return {
                id: item.season.id,
                title: item.season.title,
                href: `/seasons/${item.season.id}`,
                image: item.season.photoSrc || item.season.photoSrcProd || null,
                imagePath: '/images/series/',
            };
        }
        if (item.episode) {
            return {
                id: item.episode.id,
                title: item.episode.title,
                href: `/episodes/${item.episode.id}`,
                image: item.episode.photoSrc || item.episode.photoSrcProd || null,
                imagePath: '/images/series/',
            };
        }

        return { id: item.id, title: 'Unknown', href: '#', image: null, imagePath: '' };
    };

    const typeFilters = ['movies', 'series', 'actors', 'crew', 'seasons', 'episodes'];

    const buildImageSrc = (image: string | null, imagePath: string) => {
        if (!image) return '/images/placeholder.jpg';
        if (image.startsWith('http')) return image;
        return `${imagePath}${image}`;
    };

    return (
        <AppLayout title="My Favorites">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-foreground">My Favorites — {label}</h1>
                    <div className="flex gap-2 flex-wrap justify-end">
                        {typeFilters.map((t) => (
                            <Button
                                key={t}
                                variant={activeType === t ? "default" : "outline"}
                                size="sm"
                                asChild
                                className="capitalize"
                            >
                                <Link href={`/users/favorites/list?type=${t}`}>{t}</Link>
                            </Button>
                        ))}
                    </div>
                </div>

                {items.length === 0 ? (
                    <p className="text-muted-foreground text-center py-16">No favorites yet.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {items.map((item) => {
                            const normalized = normalize(item);
                            return (
                            <Link key={item.id} href={normalized.href} className="group">
                                <Card className="overflow-hidden border-border group-hover:border-primary transition-colors">
                                    <img
                                        src={buildImageSrc(normalized.image, normalized.imagePath)}
                                        alt={normalized.title}
                                        className="w-full aspect-[2/3] object-cover"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                    />
                                    <CardContent className="p-2">
                                        <p className="text-foreground text-sm font-medium truncate">{normalized.title}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
