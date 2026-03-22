import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface Actor { id: number; fullname: string; photoSrc: string | null; birthDate: string | null }
interface Pagination { total: number; page: number; totalPages: number }

export default function ActorsIndex({ actors, pagination, searchQuery }: { actors: Actor[]; pagination: Pagination; searchQuery?: string }) {
    return (
        <AppLayout title="Actors">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Actors</h1>
                    <form action="/actors/search" method="GET" className="flex gap-2">
                        <input type="text" name="fullname" defaultValue={searchQuery ?? ''} placeholder="Search actors…"
                            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm" />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Search</button>
                    </form>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-5">
                    {actors.map((actor) => (
                        <Link key={actor.id} href={`/actors/${actor.id}`} className="group text-center">
                            <div className="aspect-[3/4] bg-gray-800 rounded-xl overflow-hidden mb-2 group-hover:border-2 group-hover:border-indigo-500 transition-all">
                                {actor.photoSrc
                                    ? <img src={`/images/actors/${actor.photoSrc}`} alt={actor.fullname} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    : <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">👤</div>
                                }
                            </div>
                            <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">{actor.fullname}</h3>
                        </Link>
                    ))}
                </div>
                {pagination?.totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-4">
                        {Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => i + 1).map((p) => (
                            <Link key={p} href={`/actors?page=${p}`} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${p === pagination.page ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{p}</Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
