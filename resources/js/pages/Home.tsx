import { Head, Link } from '@inertiajs/react';
import AppLayout from '../layouts/AppLayout';

interface HomeProps {
    totalMovies: number;
    totalSeries: number;
    totalActors: number;
}

export default function Home({ totalMovies, totalSeries, totalActors }: HomeProps) {
    return (
        <AppLayout title="Home">
            {/* Hero */}
            <section className="text-center py-20">
                <h1 className="text-5xl font-extrabold text-white mb-4">
                    Welcome to <span className="text-indigo-400">Movielandia24</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                    Discover movies, series, actors, and more. Build your watch lists, write reviews, and connect with the community.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/movies" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                        Browse Movies
                    </Link>
                    <Link href="/series" className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                        Browse Series
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
                {[
                    { label: 'Movies', count: totalMovies, href: '/movies', icon: '🎬' },
                    { label: 'Series', count: totalSeries, href: '/series', icon: '📺' },
                    { label: 'Actors', count: totalActors, href: '/actors', icon: '⭐' },
                ].map(({ label, count, href, icon }) => (
                    <Link key={label} href={href} className="bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center transition-colors group">
                        <div className="text-4xl mb-3">{icon}</div>
                        <div className="text-4xl font-bold text-indigo-400 mb-1">{count.toLocaleString()}</div>
                        <div className="text-gray-400 group-hover:text-gray-300">{label}</div>
                    </Link>
                ))}
            </section>

            {/* Quick links */}
            <section className="py-10">
                <h2 className="text-2xl font-bold text-white mb-6">Explore</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Genres', href: '/genres', icon: '🏷️' },
                        { label: 'Crew', href: '/crew', icon: '🎥' },
                        { label: 'Forum', href: '/forum', icon: '💬' },
                        { label: 'My Lists', href: '/lists', icon: '📋' },
                    ].map(({ label, href, icon }) => (
                        <Link key={label} href={href} className="bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center gap-3 transition-colors">
                            <span className="text-2xl">{icon}</span>
                            <span className="font-medium text-gray-200">{label}</span>
                        </Link>
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}
