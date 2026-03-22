import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../layouts/AppLayout';

// ─── helpers ─────────────────────────────────────────────────────────────────

function imgSrc(photoSrc: string | null | undefined, subDir: string): string {
    if (!photoSrc) return '/images/placeholder.jpg';
    if (photoSrc.startsWith('http://') || photoSrc.startsWith('https://')) return photoSrc;
    return `/images/${subDir}/${photoSrc}`;
}

function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.src = '/images/placeholder.jpg';
}

// ─── types ───────────────────────────────────────────────────────────────────

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

type TabId = 'all' | 'movies' | 'series' | 'actors' | 'crew' | 'users';

interface SearchProps {
    movies?: MediaItem[];
    series?: MediaItem[];
    actors?: PersonItem[];
    crew?: PersonItem[];
    users?: UserItem[];
    moviesPagination?: Pagination;
    seriesPagination?: Pagination;
    actorsPagination?: Pagination;
    crewPagination?: Pagination;
    usersPagination?: Pagination;
    searchQuery?: string;
    tab?: TabId;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function MediaCard({ item, type }: { item: MediaItem; type: 'movies' | 'series' }) {
    const src = imgSrc(item.photoSrc, type);
    return (
        <Link href={`/${type}/${item.id}`} className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="aspect-[2/3] bg-gray-800 overflow-hidden">
                <img src={src} alt={item.title} onError={onImgError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-3">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                <div className="flex items-center justify-between mt-1">
                    {item.releaseYear && <span className="text-xs text-gray-400">{item.releaseYear}</span>}
                    {item.ratingImdb != null && <span className="text-xs text-yellow-400 font-medium">{item.ratingImdb.toFixed(1)}</span>}
                </div>
            </div>
        </Link>
    );
}

function PersonCard({ item, type }: { item: PersonItem; type: 'actors' | 'crew' }) {
    const src = imgSrc(item.photoSrc, type);
    return (
        <Link href={`/${type}/${item.id}`} className="group text-center">
            <div className="aspect-[3/4] bg-gray-800 rounded-xl overflow-hidden mb-2 border border-gray-700 group-hover:border-indigo-500 transition-colors">
                <img src={src} alt={item.fullname} onError={onImgError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">{item.fullname}</p>
            {item.role && <p className="text-xs text-gray-500 truncate">{item.role}</p>}
        </Link>
    );
}

function UserCard({ item }: { item: UserItem }) {
    const src = imgSrc(item.avatar, 'avatars');
    return (
        <Link href={`/users/${item.id}`} className="group flex items-center gap-3 bg-gray-900 rounded-xl p-3 border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden flex-shrink-0">
                <img src={src} alt={item.userName} onError={onImgError} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate group-hover:text-indigo-300 transition-colors">{item.userName}</p>
                {item.countryFrom && <p className="text-xs text-gray-500 truncate">{item.countryFrom}</p>}
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
                <Link href={href(pagination.page - 1)} className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">← Prev</Link>
            )}
            {pages.map((p) => (
                <Link key={p} href={href(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${p === pagination.page ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{p}</Link>
            ))}
            {pagination.page < pagination.totalPages && (
                <Link href={href(pagination.page + 1)} className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">Next →</Link>
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
        <section className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-800/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-white">{title}</span>
                    {count !== undefined && (
                        <span className="text-sm text-gray-400 font-normal">({count.toLocaleString()} results)</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {viewAllHref && open && (
                        <Link
                            href={viewAllHref}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            View all →
                        </Link>
                    )}
                    <span className="text-gray-400 transition-transform duration-200" style={{ display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </div>
            </button>
            {open && <div className="px-6 pb-6">{children}</div>}
        </section>
    );
}

// ─── main page ───────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'Series' },
    { id: 'actors', label: 'Actors' },
    { id: 'crew', label: 'Crew' },
    { id: 'users', label: 'Users' },
];

export default function Search({
    movies = [], series = [], actors = [], crew = [], users = [],
    moviesPagination, seriesPagination, actorsPagination, crewPagination, usersPagination,
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
        (usersPagination?.total ?? 0);

    return (
        <AppLayout title="Search">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-5">Search</h1>
                    <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search movies, series, actors, crew, users…"
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-base"
                            autoFocus
                        />
                        <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors">
                            Search
                        </button>
                    </form>
                </div>

                {/* Tabs */}
                {hasSearched && (
                    <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-0">
                        {TABS.map((t) => (
                            <Link
                                key={t.id}
                                href={tabHref(t.id)}
                                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px ${
                                    tab === t.id
                                        ? 'text-indigo-400 border-indigo-400 bg-gray-900'
                                        : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                                }`}
                            >
                                {t.label}
                            </Link>
                        ))}
                        {hasSearched && totalResults > 0 && (
                            <span className="ml-auto text-sm text-gray-500 self-center pb-2">
                                {totalResults.toLocaleString()} total results
                            </span>
                        )}
                    </div>
                )}

                {/* No results */}
                {hasSearched && totalResults === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl mb-2">No results found</p>
                        <p className="text-sm">Try a different search term.</p>
                    </div>
                )}

                {/* All tab — collapsible sections */}
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
                            <p className="text-gray-500 text-sm py-4">No movies found.</p>
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
                            <p className="text-gray-500 text-sm py-4">No series found.</p>
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
                            <p className="text-gray-500 text-sm py-4">No actors found.</p>
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
                            <p className="text-gray-500 text-sm py-4">No crew found.</p>
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
                            <p className="text-gray-500 text-sm py-4">No users found.</p>
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
            </div>
        </AppLayout>
    );
}
