import { Link } from '@inertiajs/react';
import { Card, CardContent } from './ui/card';

interface MediaGridProps {
    items: Array<{
        id: number;
        title: string;
        photoSrc?: string | null;
        releaseYear?: number | null;
        ratingImdb?: number | null;
    }>;
    type: 'movies' | 'series';
}

export function MediaGrid({ items, type }: MediaGridProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">Nothing found.</div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => {
                const imgSrc = item.photoSrc
                    ? `/images/${type}/${item.photoSrc}`
                    : '/images/placeholder.jpg';

                return (
                    <Link key={item.id} href={`/${type}/${item.id}`} className="group">
                        <Card className="overflow-hidden border-border hover:border-primary transition-colors h-full">
                            <div className="aspect-[2/3] bg-secondary overflow-hidden">
                                <img
                                    src={imgSrc}
                                    alt={item.title}
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <CardContent className="p-3">
                                <h3 className="text-sm font-medium text-foreground truncate">{item.title}</h3>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-muted-foreground">{item.releaseYear ?? '—'}</span>
                                    {item.ratingImdb != null && (
                                        <span className="text-xs text-yellow-400 font-medium">
                                            {item.ratingImdb.toFixed(1)}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
