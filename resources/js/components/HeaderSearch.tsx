import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';

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
            <button
                onClick={() => setOpen(true)}
                className="text-gray-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"
                aria-label="Open search"
            >
                <Search size={20} />
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
                    onClick={close}
                >
                    <div
                        className="w-full max-w-xl bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search input */}
                        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                            <Search size={18} className="text-gray-400 flex-shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            <button type="submit" className="flex-shrink-0" aria-label="Submit">
                                <span className="border border-gray-600 rounded px-1.5 py-0.5 text-xs text-gray-400">↵</span>
                            </button>
                        </form>

                        {/* Category tabs */}
                        <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-gray-800">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                        category === cat.id
                                            ? 'bg-white text-gray-900'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Results */}
                        <div className="max-h-80 overflow-y-auto">
                            {!query.trim() ? (
                                <div className="py-10 text-center">
                                    <p className="text-gray-400 text-sm">Select a category and start typing to search</p>
                                    <p className="text-gray-600 text-xs mt-1">
                                        You can search across movies, series, actors, and more
                                    </p>
                                </div>
                            ) : loading ? (
                                <div className="py-8 text-center text-gray-500 text-sm">Searching…</div>
                            ) : results.length === 0 ? (
                                <div className="py-8 text-center text-gray-500 text-sm">
                                    No results for &ldquo;{query}&rdquo;
                                </div>
                            ) : (
                                <div className="py-2">
                                    {results.map((r) => (
                                        <a
                                            key={`${r.type}-${r.id}`}
                                            href={r.href}
                                            onClick={close}
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 transition-colors group"
                                        >
                                            <div className="w-10 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
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
                                                <p className="text-white text-sm font-semibold truncate group-hover:text-indigo-300 transition-colors">
                                                    {r.title}
                                                    {r.year ? ` (${r.year})` : ''}
                                                </p>
                                                {r.subtitle && (
                                                    <p className="text-gray-500 text-xs">{r.subtitle}</p>
                                                )}
                                                {r.description && (
                                                    <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">
                                                        {r.description}
                                                    </p>
                                                )}
                                            </div>
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
