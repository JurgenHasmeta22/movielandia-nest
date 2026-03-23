import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import type { MediaItem } from '../types/media';

interface MediaCardProps {
    item: MediaItem;
    type: 'movies' | 'series';
    /** Use the overlay style (for carousels / hero row). Defaults to the bordered grid card. */
    variant?: 'overlay' | 'card';
}

export function MediaCard({ item, type, variant = 'card' }: MediaCardProps) {
    const imgSrc = item.photoSrc
        ? `/images/${type}/${item.photoSrc}`
        : '/images/placeholder.jpg';

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = '/images/placeholder.jpg';
    };

    if (variant === 'overlay') {
        return (
            <Link href={`/${type}/${item.id}`} className="group flex-shrink-0 w-36 sm:w-44">
                <div className="relative rounded-xl overflow-hidden shadow-lg ring-1 ring-white/5 group-hover:ring-primary transition-all duration-300">
                    <img
                        src={imgSrc}
                        alt={item.title}
                        onError={handleImgError}
                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.ratingImdb != null && (
                        <div className="absolute top-2 left-2">
                            <Badge className="bg-black/70 backdrop-blur-sm text-yellow-400 border-0 text-xs font-bold">
                                {item.ratingImdb.toFixed(1)}
                            </Badge>
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3">
                        <p className="text-white text-sm font-semibold leading-tight line-clamp-2">{item.title}</p>
                        {item.releaseYear && (
                            <p className="text-gray-400 text-xs mt-0.5">{item.releaseYear}</p>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/${type}/${item.id}`} className="group">
            <Card className="overflow-hidden border-border hover:border-primary transition-colors h-full">
                <div className="aspect-[2/3] bg-secondary overflow-hidden">
                    <img
                        src={imgSrc}
                        alt={item.title}
                        onError={handleImgError}
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
}
