import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface SharedProps {
    auth?: { user?: { id: number; userName: string } | null };
    flash: { type: string; message: string } | null;
    [key: string]: unknown;
}

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
}

// Poster grid cells – gradient colors to simulate a movie-poster collage
const POSTER_COLORS = [
    'from-purple-900 to-indigo-950',
    'from-rose-900 to-pink-950',
    'from-cyan-900 to-blue-950',
    'from-amber-900 to-orange-950',
    'from-emerald-900 to-teal-950',
    'from-red-900 to-rose-950',
    'from-violet-900 to-purple-950',
    'from-sky-900 to-cyan-950',
    'from-green-900 to-emerald-950',
    'from-fuchsia-900 to-pink-950',
    'from-indigo-900 to-violet-950',
    'from-orange-900 to-red-950',
];

const POSTER_LABELS = [
    '★ 9.2', '★ 8.7', '★ 9.0', '★ 8.4', '★ 8.9',
    '★ 7.8', '★ 9.1', '★ 8.3', '★ 8.6', '★ 7.9',
    '★ 9.3', '★ 8.1',
];

export default function AuthLayout({ children, title }: AuthLayoutProps) {
    const { flash, auth } = usePage<SharedProps>().props;
    const user = auth?.user;

    return (
        <>
            {title && <Head title={title} />}
            <div className="min-h-screen flex flex-col bg-gray-950">
                <header className="h-16 border-b border-gray-800 bg-gray-950/90 backdrop-blur sticky top-0 z-30">
                    <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        <Link href="/" className="text-xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
                            MovieLandia24
                        </Link>
                        <nav className="hidden md:flex items-center gap-5 text-sm">
                            <Link href="/movies" className="text-gray-300 hover:text-white transition-colors">Movies</Link>
                            <Link href="/series" className="text-gray-300 hover:text-white transition-colors">Series</Link>
                            <Link href="/actors" className="text-gray-300 hover:text-white transition-colors">Actors</Link>
                            <Link href="/crew" className="text-gray-300 hover:text-white transition-colors">Crew</Link>
                        </nav>
                        <div className="flex items-center gap-2">
                            {user ? (
                                <Link href="/users/me" className="text-sm text-gray-200 hover:text-white transition-colors">
                                    {user.userName}
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                                        Sign In
                                    </Link>
                                    <Link href="/register" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex flex-1">
                {/* ── Left: form panel ─────────────────────────────────────────── */}
                <div className="relative z-10 flex flex-col w-full lg:w-[480px] xl:w-[520px] flex-shrink-0 bg-[#111827] shadow-2xl shadow-black/60">
                    {/* Top bar */}
                    <div className="px-8 pt-8 pb-4">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <span className="text-2xl">🎬</span>
                            <span className="text-2xl font-extrabold text-yellow-400 group-hover:text-yellow-300 transition-colors tracking-tight">
                                MovieLandia24
                            </span>
                        </Link>
                    </div>

                    {/* Flash message */}
                    {flash && (
                        <div className={`mx-8 mb-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                            flash.type === 'success' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                            flash.type === 'error' ? 'bg-red-900/50 text-red-300 border border-red-700' :
                            'bg-blue-900/50 text-blue-300 border border-blue-700'
                        }`}>
                            {flash.message}
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center px-8 py-6">
                        {children}
                    </div>

                    {/* Footer */}
                    <p className="px-8 pb-6 text-center text-xs text-gray-600">
                        &copy; {new Date().getFullYear()} MovieLandia24. All rights reserved.
                    </p>
                </div>

                {/* ── Right: cinematic backdrop ─────────────────────────────────── */}
                <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gray-950">
                    {/* Poster grid */}
                    <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2 opacity-30">
                        {POSTER_COLORS.map((color, i) => (
                            <div
                                key={i}
                                className={`bg-gradient-to-br ${color} rounded-lg flex flex-col justify-end p-3`}
                            >
                                <div className="h-2 bg-white/20 rounded mb-1.5 w-3/4" />
                                <div className="h-1.5 bg-white/10 rounded w-1/2" />
                                <span className="text-yellow-400/70 text-xs mt-2 font-bold">{POSTER_LABELS[i]}</span>
                            </div>
                        ))}
                    </div>

                    {/* Overlay gradients */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-gray-950/40" />

                    {/* Center tagline */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full px-16 text-center">
                        <div className="mb-6 w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-4xl">
                            🎬
                        </div>
                        <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
                            Your World of<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                Cinema
                            </span>
                        </h2>
                        <p className="text-gray-400 text-base max-w-xs leading-relaxed">
                            Track, rate and discover movies & series. Join thousands of film lovers today.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-gray-500">
                            {['🎥 Reviews', '📋 Watchlists', '💬 Community', '⭐ Ratings'].map((t) => (
                                <span key={t} className="bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}
