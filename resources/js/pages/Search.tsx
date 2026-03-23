import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function imgSrc(photoSrc: string | null | undefined, subDir: string): string {
    if (!photoSrc) return '/images/placeholder.jpg';
    if (photoSrc.startsWith('http://') || photoSrc.startsWith('https://')) return photoSrc;
    return `/images/${subDir}/${photoSrc}`;
}

function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.src = '/images/placeholder.jpg';
}

// â”€â”€â”€ types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface MediaItem {
    id: number;
    title: string;
    photoSrc?: string | null;
    ratingImdb?: number | null;
    releaseYear?: number | null;
}

interface PersonItem {
    id: number;
    fullname: string;
    photoSrc?: string | null;
    role?: string | null;
    debut?: string | null;
}

interface UserItem {
    id: number;
    userName: string;
    avatar?: string | null;
    countryFrom?: string | null;
}

interface Pagination {
    total: number;
    page: number;
    totalPages: number;
    perPage: number;
}

type TabId = 'all' | 'movies' | 'series' | 'actors' | 'crew' | 'seasons' | 'episodes' | 'users';

interface SearchProps {
    movies?: MediaItem[];
    series?: MediaItem[];
    actors?: PersonItem[];
    crew?: PersonItem[];
    seasons?: MediaItem[];
    episodes?: MediaItem[];
    users?: UserItem[];
    moviesPagination?: Pagination;
    seriesPagination?: Pagination;
    actorsPagination?: Pagination;
    crewPagination?: Pagination;
    seasonsPagination?: Pagination;
    episodesPagination?: Pagination;
    usersPagination?: Pagination;
    searchQuery?: string;
    tab?: TabId;
}

// â”€â”€â”€ sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function MediaCard({ item, type }: { item: MediaItem; type: 'movies' | 'series' | 'seasons' | 'episodes' }) {
    const src = imgSrc(item.photoSrc, type);
    return (
        <Link href={`/${type}/${item.id}`} className="group block">
            <Card className="overflow-hidden border-border hover:border-primary transition-colors bg-card">
                <div className="aspect-[2/3] bg-muted overflow-hidden">
                    <img src={src} alt={item.title} onError={onImgError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <CardContent className="p-3">
                    <p className="text-foreground text-sm font-medium truncate">{item.title}</p>
                    <div className="flex items-center justify-between mt-1">
                        {item.releaseYear && <span className="text-xs text-muted-foreground">{item.releaseYear}</span>}
                        {item.ratingImdb != null && <Badge variant="secondary" className="text-xs text-yellow-400 px-1.5 py-0">{item.ratingImdb.toFixed(1)}</Badge>}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function PersonCard({ item, type }: { item: PersonItem; type: 'actors' | 'crew' }) {
    const src = imgSrc(item.photoSrc, type);
    return (
        <Link href={`/${type}/${item.id}`} className="group text-center block">
            <Card className="overflow-hidden border-border group-hover:border-primary transition-colors bg-card mb-2">
                <div className="aspect-[3/4] overflow-hidden">
                    <img src={src} alt={item.fullname} onError={onImgError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
            </Card>
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">{item.fullname}</p>
            {item.role && <p className="text-xs text-muted-foreground/60 truncate">{item.role}</p>}
        </Link>
    );
}

function UserCard({ item }: { item: UserItem }) {
    const src = imgSrc(item.avatar, 'avatars');
    return (
        <Link href={`/users/${item.id}`} className="group flex items-center gap-3 bg-card rounded-xl p-3 border border-border hover:border-primary transition-colors">
            <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
                <img src={src} alt={item.userName} onError={onImgError} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
                <p className="text-foreground text-sm font-medium truncate group-hover:text-primary transition-colors">{item.userName}</p>
                {item.countryFrom && <p className="text-xs text-muted-foreground truncate">{item.countryFrom}</p>}
            </div>
        </Link>
    );
}

function PaginationBar({ pagination, href }: { pagination: Pagination; href: (p: number) => string }) {
    if (pagination.totalPages <= 1) return null;
    const pages = Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => i + 1);
    return (
        <div className="flex flex-wrap justify-center gap-2 mt-6">
            {pagination.page > 1 && (
                <Button variant="outline" size="sm" asChild>
                    <Link href={href(pagination.page - 1)}>â† Prev</Link>
                </Button>
            )}
            {pages.map((p) => (
                <Button key={p} variant={p === pagination.page ? 'default' : 'outline'} size="sm" asChild>
                    <Link href={href(p)}>{p}</Link>
                </Button>
            ))}
            {pagination.page < pagination.totalPages && (
                <Button variant="outline" size="sm" asChild>
                    <Link href={href(pagination.page + 1)}>Next â†’</Link>
                </Button>
            )}
        </div>
    );
}

interface SectionProps {
    title: string;
    count?: number;
    viewAllHref?: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

function Section({ title, count, viewAllHref, defaultOpen = true, children }: SectionProps) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Card className="bg-card border-border overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-foreground">{title}</span>
                    {count !== undefined && (
                        <span className="text-sm text-muted-foreground font-normal">({count.toLocaleString()} results)</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {viewAllHref && open && (
                        <Link
                            href={viewAllHref}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            View all â†’
                        </Link>
                    )}
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
                </div>
            </button>
            {open && <div className="px-6 pb-6">{children}</div>}
        </Card>
    );
}

// â”€â”€â”€ main page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TABS: { id: TabId; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'Series' },
    { id: 'actors', label: 'Actors' },
    { id: 'crew', label: 'Crew' },
    { id: 'seasons', label: 'Seasons' },
    { id: 'episodes', label: 'Episodes' },
    { id: 'users', label: 'Users' },
];

export default function Search({
    movies = [], series = [], actors = [], crew = [], seasons = [], episodes = [], users = [],
    moviesPagination, seriesPagination, actorsPagination, crewPagination,
    seasonsPagination, episodesPagination, usersPagination,
    searchQuery = '', tab = 'all',
}: SearchProps) {
    const [query, setQuery] = useState(searchQuery);
    const q = encodeURIComponent(searchQuery);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) {
            router.get('/search', { q: query.trim(), tab, page: 1 }, { preserveScroll: false });
        }
    }

    function tabHref(t: TabId) {
        return `/search?q=${q}&tab=${t}&page=1`;
    }

    function pageHref(p: number) {
        return `/search?q=${q}&tab=${tab}&page=${p}`;
    }

    const hasSearched = searchQuery.trim().length > 0;
    const totalResults =
        (moviesPagination?.total ?? 0) +
        (seriesPagination?.total ?? 0) +
        (actorsPagination?.total ?? 0) +
        (crewPagination?.total ?? 0) +
        (seasonsPagination?.total ?? 0) +
        (episodesPagination?.total ?? 0) +
        (usersPagination?.total ?? 0);

    return (
        <AppLayout title="Search">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    {hasSearched ? (
                        <>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Search Results for &ldquo;{searchQuery}&rdquo;
                            </h1>
                            {totalResults > 0 && (
                                <p className="text-muted-foreground text-sm mb-5">
                                    Found {totalResults.toLocaleString()} results across all categories
                                </p>
                            )}
                        </>
                    ) : (
                        <h1 className="text-3xl font-bold text-foreground mb-5">Search</h1>
                    )}
                    <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
                        <Input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search movies, series, actors, crew, usersâ€¦"
                            className="flex-1 text-base"
                            autoFocus
                        />
                        <Button type="submit">Search</Button>
                    </form>
                </div>

                {/* Tabs */}
                {hasSearched && (
                    <div className="flex flex-wrap gap-2 border-b border-border pb-0">
                        {TABS.map((t) => (
                            <Link
                                key={t.id}
                                href={tabHref(t.id)}
                                className={cn(
                                    "px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px",
                                    tab === t.id
                                        ? "text-primary border-primary bg-card"
                                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                                )}
                            >
                                {t.label}
                            </Link>
                        ))}
                        {hasSearched && totalResults > 0 && (
                            <span className="ml-auto text-sm text-muted-foreground self-center pb-2">
                                {totalResults.toLocaleString()} total results
                            </span>
                        )}
                    </div>
                )}

                {/* No results */}
                {hasSearched && totalResults === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p className="text-xl mb-2">No results found</p>
                        <p className="text-sm">Try a different search term.</p>
                    </div>
                )}

                {/* All tab â€” collapsible sections */}
                {tab === 'all' && (
                    <div className="space-y-4">
                        {movies.length > 0 && (
                            <Section title="Movies" count={moviesPagination?.total} viewAllHref={`/search?q=${q}&tab=movies`}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {movies.map((m) => <MediaCard key={m.id} item={m} type="movies" />)}
                                </div>
                            </Section>
                        )}
                        {series.length > 0 && (
                            <Section title="Series" count={seriesPagination?.total} viewAllHref={`/search?q=${q}&tab=series`}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {series.map((s) => <MediaCard key={s.id} item={s} type="series" />)}
                                </div>
                            </Section>
                        )}
                        {actors.length > 0 && (
                            <Section title="Actors" count={actorsPagination?.total} viewAllHref={`/search?q=${q}&tab=actors`}>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {actors.map((a) => <PersonCard key={a.id} item={a} type="actors" />)}
                                </div>
                            </Section>
                        )}
                        {crew.length > 0 && (
                            <Section title="Crew" count={crewPagination?.total} viewAllHref={`/search?q=${q}&tab=crew`}>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {crew.map((c) => <PersonCard key={c.id} item={c} type="crew" />)}
                                </div>
                            </Section>
                        )}
                        {seasons.length > 0 && (
                            <Section title="Seasons" count={seasonsPagination?.total} viewAllHref={`/search?q=${q}&tab=seasons`}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {seasons.map((s) => <MediaCard key={s.id} item={s} type="seasons" />)}
                                </div>
                            </Section>
                        )}
                        {episodes.length > 0 && (
                            <Section title="Episodes" count={episodesPagination?.total} viewAllHref={`/search?q=${q}&tab=episodes`}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {episodes.map((e) => <MediaCard key={e.id} item={e} type="episodes" />)}
                                </div>
                            </Section>
                        )}
                        {users.length > 0 && (
                            <Section title="Users" count={usersPagination?.total} viewAllHref={`/search?q=${q}&tab=users`}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {users.map((u) => <UserCard key={u.id} item={u} />)}
                                </div>
                            </Section>
                        )}
                    </div>
                )}

                {/* Movies tab */}
                {tab === 'movies' && (
                    <Section title="Movies" count={moviesPagination?.total}>
                        {movies.length === 0 ? (
                            <p className="text-muted-foreground text-sm py-4">No movies found.</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {movies.map((m) => <MediaCard key={m.id} item={m} type="movies" />)}
                                </div>
                                {moviesPagination && <PaginationBar pagination={moviesPagination} href={pageHref} />}
                            </>
                        )}
                    </Section>
                )}

                {/* Series tab */}
                {tab === 'series' && (
                    <Section title="Series" count={seriesPagination?.total}>
                        {series.length === 0 ? (
                            <p className="text-muted-foreground text-sm py-4">No series found.</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {series.map((s) => <MediaCard key={s.id} item={s} type="series" />)}
                                </div>
                                {seriesPagination && <PaginationBar pagination={seriesPagination} href={pageHref} />}
                            </>
                        )}
                    </Section>
                )}

                {/* Actors tab */}
                {tab === 'actors' && (
                    <Section title="Actors" count={actorsPagination?.total}>
                        {actors.length === 0 ? (
                            <p className="text-muted-foreground text-sm py-4">No actors found.</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                                    {actors.map((a) => <PersonCard key={a.id} item={a} type="actors" />)}
                                </div>
                                {actorsPagination && <PaginationBar pagination={actorsPagination} href={pageHref} />}
                            </>
                        )}
                    </Section>
                )}

                {/* Crew tab */}
                {tab === 'crew' && (
                    <Section title="Crew" count={crewPagination?.total}>
                        {crew.length === 0 ? (
                            <p className="text-muted-foreground text-sm py-4">No crew found.</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                                    {crew.map((c) => <PersonCard key={c.id} item={c} type="crew" />)}
                                </div>
                                {crewPagination && <PaginationBar pagination={crewPagination} href={pageHref} />}
                            </>
                        )}
                    </Section>
                )}

                {/* Users tab */}
                {tab === 'users' && (
                    <Section title="Users" count={usersPagination?.total}>
                        {users.length === 0 ? (
                            <p className="text-muted-foreground text-sm py-4">No users found.</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {users.map((u) => <UserCard key={u.id} item={u} />)}
                                </div>
                                {usersPagination && <PaginationBar pagination={usersPagination} href={pageHref} />}
                            </>
                        )}
                    </Section>
                )}

                {/* Seasons tab */}
                {tab === 'seasons' && (
                    <Section title="Seasons" count={seasonsPagination?.total}>
                        {seasons.length === 0 ? (
                            <p className="text-muted-foreground text-sm py-4">No seasons found.</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {seasons.map((s) => <MediaCard key={s.id} item={s} type="seasons" />)}
                                </div>
                                {seasonsPagination && <PaginationBar pagination={seasonsPagination} href={pageHref} />}
                            </>
                        )}
                    </Section>
                )}

                {/* Episodes tab */}
                {tab === 'episodes' && (
                    <Section title="Episodes" count={episodesPagination?.total}>
                        {episodes.length === 0 ? (
                            <p className="text-muted-foreground text-sm py-4">No episodes found.</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {episodes.map((e) => <MediaCard key={e.id} item={e} type="episodes" />)}
                                </div>
                                {episodesPagination && <PaginationBar pagination={episodesPagination} href={pageHref} />}
                            </>
                        )}
                    </Section>
                )}
            </div>
        </AppLayout>
    );
}
