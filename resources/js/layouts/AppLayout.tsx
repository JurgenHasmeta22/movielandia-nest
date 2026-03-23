import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { type ReactNode, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HeaderSearch } from '../components/HeaderSearch';
import { PageTransition } from '../components/PageTransition';

interface AuthUser {
    id: number;
    userName: string;
    email: string;
    avatar: string | null;
}

interface Flash {
    type: 'success' | 'error' | 'info';
    message: string;
}

interface SharedProps {
    auth: { user: AuthUser | null };
    flash: Flash | null;
    [key: string]: unknown;
}

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
    const { auth, flash } = usePage<SharedProps>().props;
    const user = auth?.user;

    useEffect(() => {
        if (!flash) return;
        const fn = flash.type === 'success' ? toast.success
                 : flash.type === 'error'   ? toast.error
                 : toast.info;
        fn(flash.message);
    }, [flash]);
    const avatarSrc = user?.avatar
        ? (user.avatar.startsWith('http') ? user.avatar : `/images/users/${user.avatar}`)
        : null;

    return (
        <>
            {title && <Head title={title} />}
            <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
                {/* Navbar */}
                <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                                Movielandia24
                            </Link>

                            {/* Primary nav */}
                            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                                <Link href="/movies" className="text-gray-300 hover:text-white transition-colors">Movies</Link>
                                <Link href="/series" className="text-gray-300 hover:text-white transition-colors">Series</Link>
                                <Link href="/genres" className="text-gray-300 hover:text-white transition-colors">Genres</Link>
                                <Link href="/actors" className="text-gray-300 hover:text-white transition-colors">Actors</Link>
                                <Link href="/crew" className="text-gray-300 hover:text-white transition-colors">Crew</Link>
                                <Link href="/forum" className="text-gray-300 hover:text-white transition-colors">Forum</Link>
                            </div>

                            {/* Auth + Search */}
                            <div className="flex items-center gap-3">
                                <HeaderSearch />
                                {user ? (
                                    <details className="relative group">
                                        <summary className="list-none flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/90 px-2 py-1.5 cursor-pointer hover:border-gray-600 transition-colors">
                                            {avatarSrc ? (
                                                <img
                                                    src={avatarSrc}
                                                    alt={user.userName}
                                                    className="w-7 h-7 rounded-full object-cover"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <span className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold inline-flex items-center justify-center">
                                                    {user.userName.slice(0, 1).toUpperCase()}
                                                </span>
                                            )}
                                            <span className="text-sm text-gray-200 hidden sm:inline max-w-28 truncate">{user.userName}</span>
                                        </summary>

                                        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl p-2 z-50">
                                            <div className="px-2 py-2 border-b border-gray-800">
                                                <p className="text-sm font-medium text-white truncate">{user.userName}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <Link href="/users/me" className="block px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                                    My Profile
                                                </Link>
                                                <Link href="/users/favorites/list" className="block px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                                    Favorites
                                                </Link>
                                                <Link href="/users/reviews/list" className="block px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                                    Reviews
                                                </Link>
                                                <Link href="/users/messages/inbox" className="block px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                                    Messages
                                                </Link>
                                                <Link href="/lists" className="block px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                                    My Lists
                                                </Link>
                                            </div>
                                            <div className="pt-1 border-t border-gray-800">
                                                <form action="/logout" method="POST">
                                                    <button
                                                        type="submit"
                                                        className="w-full text-left px-2 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        Sign Out
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </details>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Flash toasts */}
                <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />

                {/* Page content */}
                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
                    <div className="max-w-7xl mx-auto px-6 py-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <p className="text-indigo-400 font-bold text-lg mb-3">Movielandia24</p>
                                <p className="text-gray-500 text-sm">Your home for movies, series, ratings and community discussion.</p>
                            </div>
                            <div>
                                <p className="text-gray-300 font-semibold text-sm mb-3 uppercase tracking-wider">Browse</p>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/movies" className="text-gray-500 hover:text-gray-300 transition-colors">Movies</Link></li>
                                    <li><Link href="/series" className="text-gray-500 hover:text-gray-300 transition-colors">Series</Link></li>
                                    <li><Link href="/genres" className="text-gray-500 hover:text-gray-300 transition-colors">Genres</Link></li>
                                    <li><Link href="/actors" className="text-gray-500 hover:text-gray-300 transition-colors">Actors</Link></li>
                                    <li><Link href="/crew" className="text-gray-500 hover:text-gray-300 transition-colors">Crew</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-gray-300 font-semibold text-sm mb-3 uppercase tracking-wider">Community</p>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/forum" className="text-gray-500 hover:text-gray-300 transition-colors">Forum</Link></li>
                                    <li><Link href="/lists" className="text-gray-500 hover:text-gray-300 transition-colors">Lists</Link></li>
                                    <li><Link href="/search" className="text-gray-500 hover:text-gray-300 transition-colors">Search</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-gray-300 font-semibold text-sm mb-3 uppercase tracking-wider">Account</p>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/login" className="text-gray-500 hover:text-gray-300 transition-colors">Sign In</Link></li>
                                    <li><Link href="/register" className="text-gray-500 hover:text-gray-300 transition-colors">Sign Up</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
                            &copy; {new Date().getFullYear()} Movielandia24. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
