/// <reference types="vite/client" />
import { Link } from "@inertiajs/react";
import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { MediaCarousel } from "../components/MediaCarousel";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import type { MediaItem } from "../types/media";

const TESTIMONIALS = [
    {
        name: "Olivia Thompson",
        role: "Cinema Critic",
        stars: 5,
        quote: "The review system on MovieLandia24 is exceptional. I can express my thoughts in detail, and the community engagement with reviews creates meaningful conversations about cinema.",
    },
    {
        name: "Sarah Johnson",
        role: "Film Enthusiast",
        stars: 5,
        quote: "MovieLandia24 has completely transformed how I discover new films. The recommendations are spot-on, and I love being able to create custom watchlists for different moods and occasions.",
    },
    {
        name: "Michael Chen",
        role: "TV Series Buff",
        stars: 4.5,
        quote: "As someone who watches a lot of TV series, I appreciate how well-organized everything is on MovieLandia24. The episode tracking feature is particularly useful, and the community discussions add so much value.",
    },
    {
        name: "Elena Rodriguez",
        role: "Horror Fan",
        stars: 5,
        quote: "The genre filtering on MovieLandia24 is incredibly detailed. I can always find exactly what I'm in the mood for, whether it's a classic horror film or the latest psychological thriller.",
    },
    {
        name: "James Walker",
        role: "Documentary Lover",
        stars: 4,
        quote: "I've tried many movie tracking apps, but MovieLandia24 stands out for its clean interface and comprehensive database. The documentary section is particularly impressive.",
    },
];

const FAQ_ITEMS = [
    {
        q: "What is MovieLandia24?",
        a: "MovieLandia24 is a comprehensive movie and TV series platform where you can discover, rate, and discuss your favourite content. Build watchlists, write reviews, and connect with a community of film enthusiasts.",
    },
    {
        q: "Is MovieLandia24 free to use?",
        a: "Yes, MovieLandia24 is completely free to use. Create a free account to unlock all features including watchlists, reviews, and community discussions.",
    },
    {
        q: "How do I create a watchlist?",
        a: "Once you create an account and log in, navigate to any movie or series and click the 'Add to List' button. You can create multiple custom lists to organise your content.",
    },
    {
        q: "Can I write reviews for movies and TV shows?",
        a: "Absolutely! Registered users can write reviews, rate content, and upvote or downvote other reviews. Your contributions help the community make better viewing choices.",
    },
    {
        q: "How are movie and TV show ratings calculated?",
        a: "Ratings on MovieLandia24 are based on the average of all user ratings submitted for each title. We also display IMDb ratings for reference where available.",
    },
];

function StarRating({ stars }: { stars: number }) {
    return (
        <div className="flex items-center gap-0.5 mt-2">
            {[1, 2, 3, 4, 5].map((i) => {
                const fill = stars >= i ? "full" : stars >= i - 0.5 ? "half" : "empty";
                return (
                    <span key={i} className={fill === "empty" ? "text-gray-600" : "text-yellow-400"}>
                        {fill === "half" ? "★" : fill === "full" ? "★" : "☆"}
                    </span>
                );
            })}
        </div>
    );
}

function TestimonialsSection() {
    const [idx, setIdx] = useState(0);
    const visible = [
        TESTIMONIALS[idx % TESTIMONIALS.length],
        TESTIMONIALS[(idx + 1) % TESTIMONIALS.length],
        TESTIMONIALS[(idx + 2) % TESTIMONIALS.length],
    ];
    const dots = Array.from({ length: TESTIMONIALS.length }, (_, i) => i);

    return (
        <section className="mb-16">
            <div className="text-center mb-10">
                <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                    <span>👥</span> User Testimonials
                </p>
                <h2 className="text-3xl font-bold text-foreground mb-3">What Our Community Says</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                    Join thousands of satisfied users who have discovered their next favorite movies and shows through MovieLandia24.
                </p>
            </div>

            <div className="relative">
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full"
                    onClick={() => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                    aria-label="Previous"
                >
                    ‹
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mx-4">
                    {visible.map((t, i) => (
                        <Card key={i} className="flex flex-col">
                            <CardContent className="p-6 flex flex-col flex-1">
                                <span className="text-muted-foreground text-3xl font-serif leading-none mb-4">"</span>
                                <p className="text-muted-foreground text-sm flex-1 italic">"{t.quote}"</p>
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-sm">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-foreground text-sm font-semibold">{t.name}</p>
                                        <p className="text-muted-foreground text-xs">{t.role}</p>
                                        <StarRating stars={t.stars} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full"
                    onClick={() => setIdx((i) => (i + 1) % TESTIMONIALS.length)}
                    aria-label="Next"
                >
                    ›
                </Button>
            </div>

            <div className="flex justify-center gap-2 mt-6">
                {dots.map((d) => (
                    <button
                        key={d}
                        onClick={() => setIdx(d)}
                        className={`w-2 h-2 rounded-full transition-colors ${d === idx % TESTIMONIALS.length ? "bg-primary" : "bg-border"}`}
                        aria-label={`Go to testimonial ${d + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

function FAQSection() {
    return (
        <section className="mb-16">
            <div className="text-center mb-10">
                <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                    <span>💬</span> Frequently Asked Questions
                </p>
                <h2 className="text-3xl font-bold text-foreground mb-3">Got Questions? We&apos;ve Got Answers</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                    Find answers to the most common questions about MovieLandia24 and how to make the most of your experience.
                </p>
            </div>
            <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="space-y-3">
                    {FAQ_ITEMS.map((item, i) => (
                        <AccordionItem
                            key={i}
                            value={`faq-${i}`}
                            className="border border-border rounded-xl bg-card overflow-hidden px-6"
                        >
                            <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline">
                                {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                {item.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}

interface Genre {
    id: number;
    name: string;
    _count?: { movies: number; series: number };
}

interface Props {
    latestMovies: MediaItem[];
    latestSeries: MediaItem[];
    genres: Genre[];
}

const GENRE_COLORS = [
    "from-purple-700 to-indigo-900", "from-pink-700 to-rose-900",
    "from-blue-700 to-cyan-900",     "from-emerald-700 to-teal-900",
    "from-orange-700 to-amber-900",  "from-red-700 to-rose-900",
    "from-violet-700 to-purple-900", "from-sky-700 to-blue-900",
    "from-green-700 to-emerald-900", "from-fuchsia-700 to-pink-900",
];

export default function Home({ latestMovies, latestSeries, genres }: Props) {
    return (
        <AppLayout title="Home">
            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-br from-card via-indigo-950 to-background border-b border-white/5 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 mb-12">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
                    <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-4">Your Streaming Universe</p>
                    <h1 className="text-5xl sm:text-7xl font-extrabold text-foreground mb-6 leading-tight">
                        Discover{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Movies</span>
                        {" & "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Series</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
                        Track what you&#39;ve watched, rate your favourites, join the community forum and build your perfect watchlists.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/movies">Browse Movies</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/series">Browse Series</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/search">Search</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Carousels */}
            <MediaCarousel items={latestMovies} type="movies" title="Latest Movies" viewAllHref="/movies" />
            <MediaCarousel items={latestSeries} type="series" title="Latest Series" viewAllHref="/series" />

            {/* Genres grid */}
            {genres.length > 0 && (
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-2xl font-bold text-foreground">Browse by Genre</h2>
                        <Button variant="link" size="sm" asChild>
                            <Link href="/genres">All genres</Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {genres.map((g, i) => (
                            <Link key={g.id} href={`/genres/${g.id}`}>
                                <div className={`bg-gradient-to-br ${GENRE_COLORS[i % GENRE_COLORS.length]} rounded-xl p-5 hover:scale-105 transition-transform duration-200`}>
                                    <p className="text-white font-bold capitalize">{g.name}</p>
                                    {g._count && (
                                        <p className="text-white/60 text-xs mt-1">
                                            {g._count.movies} movies &middot; {g._count.series} series
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA */}
            <Card className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/20 p-10 text-center mb-16">
                <CardContent className="p-0">
                    <h2 className="text-3xl font-bold text-foreground mb-3">Join the Community</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto mb-6">Discuss your favourite films, rate episodes and share lists with other movie enthusiasts.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button asChild>
                            <Link href="/forum">Go to Forum</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/register">Create Account</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <TestimonialsSection />
            <FAQSection />
        </AppLayout>
    );
}
