import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

type Category = 'all' | 'movies' | 'series' | 'actors' | 'crew' | 'seasons' | 'episodes' | 'users';

interface SearchResult {
    type: string;
    id: number;
    title: string;
    photo: string | null;
    subtitle?: string;
    description?: string;
    year?: number | null;
    href: string;
}

const CATEGORIES: { id: Category; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'Series' },
    { id: 'actors', label: 'Actors' },
    { id: 'crew', label: 'Crew' },
    { id: 'seasons', label: 'Seasons' },
    { id: 'episodes', label: 'Episodes' },
    { id: 'users', label: 'Users' },
];

export function HeaderSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<Category>('all');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') close();
        }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/search-quick?q=${encodeURIComponent(query.trim())}&category=${category}`,
                    { headers: { Accept: 'application/json' } },
                );
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.results ?? []);
                }
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 280);
        return () => clearTimeout(timer);
    }, [query, category]);

    function close() {
        setOpen(false);
        setQuery('');
        setResults([]);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) {
            close();
            router.get('/search', { q: query.trim(), tab: category });
        }
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                aria-label="Open search"
            >
                <Search size={18} />
            </Button>

            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
                    onClick={close}
                >
                    <div
                        className="w-full max-w-xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search input */}
                        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-b border-border">
                            <Search size={18} className="text-muted-foreground flex-shrink-0" />
                            <Input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 h-auto py-0 px-0 placeholder:text-muted-foreground"
                            />
                            {query && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
                                >
                                    <X size={14} />
                                </Button>
                            )}
                            <button type="submit" className="flex-shrink-0" aria-label="Submit">
                                <span className="border border-border rounded px-1.5 py-0.5 text-xs text-muted-foreground">â†µ</span>
                            </button>
                        </form>

                        {/* Category tabs */}
                        <div className="px-4 py-2 border-b border-border">
                            <Tabs value={category} onValueChange={(v) => setCategory(v as Category)}>
                                <TabsList className="h-auto bg-transparent p-0 flex flex-wrap gap-1">
                                    {CATEGORIES.map((cat) => (
                                        <TabsTrigger
                                            key={cat.id}
                                            value={cat.id}
                                            className="h-7 rounded-md px-3 text-xs data-[state=active]:bg-foreground data-[state=active]:text-background"
                                        >
                                            {cat.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Results */}
                        <div className="max-h-80 overflow-y-auto">
                            {!query.trim() ? (
                                <div className="py-10 text-center">
                                    <p className="text-muted-foreground text-sm">Select a category and start typing to search</p>
                                    <p className="text-muted-foreground/60 text-xs mt-1">
                                        You can search across movies, series, actors, and more
                                    </p>
                                </div>
                            ) : loading ? (
                                <div className="py-8 text-center text-muted-foreground text-sm">Searchingâ€¦</div>
                            ) : results.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground text-sm">
                                    No results for &ldquo;{query}&rdquo;
                                </div>
                            ) : (
                                <div className="py-2">
                                    {results.map((r) => (
                                        <a
                                            key={`${r.type}-${r.id}`}
                                            href={r.href}
                                            onClick={close}
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors group"
                                        >
                                            <div className="w-10 h-14 bg-secondary rounded overflow-hidden flex-shrink-0">
                                                {r.photo && (
                                                    <img
                                                        src={r.photo}
                                                        alt={r.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-foreground text-sm font-semibold truncate group-hover:text-primary transition-colors">
                                                    {r.title}
                                                    {r.year ? ` (${r.year})` : ''}
                                                </p>
                                                {r.subtitle && (
                                                    <p className="text-muted-foreground text-xs">{r.subtitle}</p>
                                                )}
                                                {r.description && (
                                                    <p className="text-muted-foreground/70 text-xs mt-0.5 line-clamp-2">
                                                        {r.description}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge variant="secondary" className="text-[10px] shrink-0">{r.type}</Badge>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
