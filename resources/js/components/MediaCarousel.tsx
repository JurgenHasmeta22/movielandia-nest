import Autoplay from 'embla-carousel-autoplay';
import { Link } from '@inertiajs/react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from './ui/carousel';
import type { MediaItem } from '../types/media';

interface MediaCarouselProps {
    items: MediaItem[];
    type: 'movies' | 'series';
    title: string;
    viewAllHref: string;
}

export function MediaCarousel({ items, type, title, viewAllHref }: MediaCarouselProps) {
    if (items.length === 0) return null;

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                <Button variant="link" size="sm" asChild>
                    <Link href={viewAllHref}>View all</Link>
                </Button>
            </div>

            <Carousel
                opts={{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }}
                plugins={[Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {items.map((item) => {
                        const imgSrc = item.photoSrc
                            ? `/images/${type}/${item.photoSrc}`
                            : '/images/placeholder.jpg';
                        return (
                            <CarouselItem key={item.id} className="pl-4 basis-[144px] sm:basis-[176px]">
                                <Link
                                    href={`/${type}/${item.id}`}
                                    className="group block"
                                    draggable={false}
                                >
                                    <div className="relative rounded-xl overflow-hidden shadow-lg ring-1 ring-white/5 group-hover:ring-primary transition-all duration-300">
                                        <img
                                            src={imgSrc}
                                            alt={item.title}
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                            draggable={false}
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
                                            <p className="text-white text-sm font-semibold leading-tight line-clamp-2">
                                                {item.title}
                                            </p>
                                            {item.releaseYear && (
                                                <p className="text-gray-400 text-xs mt-0.5">{item.releaseYear}</p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
            </Carousel>
        </section>
    );
}
