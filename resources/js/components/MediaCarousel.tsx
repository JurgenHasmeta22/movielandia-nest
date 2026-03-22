import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import type { MediaItem } from '../types/media';

interface MediaCarouselProps {
    items: MediaItem[];
    type: 'movies' | 'series';
    title: string;
    viewAllHref: string;
}

export function MediaCarousel({ items, type, title, viewAllHref }: MediaCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { align: 'start', dragFree: true, containScroll: 'trimSnaps' },
        [Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })],
    );

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    if (items.length === 0) return null;

    return (
        <section className="mb-12">
            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <div className="flex items-center gap-3">
                    <Link
                        href={viewAllHref}
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                    >
                        View all
                    </Link>
                    {/* Nav buttons */}
                    <button
                        onClick={scrollPrev}
                        disabled={!canScrollPrev}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={scrollNext}
                        disabled={!canScrollNext}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Embla viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4 select-none">
                    {items.map((item) => {
                        const imgSrc = item.photoSrc
                            ? `/images/${type}/${item.photoSrc}`
                            : '/images/placeholder.jpg';

                        return (
                            <Link
                                key={item.id}
                                href={`/${type}/${item.id}`}
                                className="group flex-shrink-0 w-36 sm:w-44"
                                draggable={false}
                            >
                                <div className="relative rounded-xl overflow-hidden shadow-lg ring-1 ring-white/5 group-hover:ring-indigo-500 transition-all duration-300">
                                    <img
                                        src={imgSrc}
                                        alt={item.title}
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                        draggable={false}
                                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {item.ratingImdb != null && (
                                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                                            {item.ratingImdb.toFixed(1)}
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
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
