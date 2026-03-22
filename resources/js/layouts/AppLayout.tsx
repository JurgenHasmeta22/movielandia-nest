import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { HeaderSearch } from '../components/HeaderSearch';

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
                                    <>
                                        <Link href="/users/me" className="text-sm text-gray-300 hover:text-white transition-colors">
                                            {user.userName}
                                        </Link>
                                        <Link href="/lists" className="text-sm text-gray-300 hover:text-white transition-colors">
                                            My Lists
                                        </Link>
                                        <form action="/logout" method="POST">
                                            <button
                                                type="submit"
                                                className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </form>
                                    </>
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

                {/* Flash messages */}
                {flash && (
                    <div className={`px-4 py-3 text-sm font-medium text-center ${
                        flash.type === 'success' ? 'bg-green-800 text-green-100' :
                        flash.type === 'error' ? 'bg-red-800 text-red-100' :
                        'bg-blue-800 text-blue-100'
                    }`}>
                        {flash.message}
                    </div>
                )}

                {/* Page content */}
                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                    {children}
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
