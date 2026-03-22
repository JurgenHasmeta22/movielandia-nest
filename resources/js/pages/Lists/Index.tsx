import { Link, useForm } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface List { id: number; name: string; description: string | null; isPublic: boolean; itemCount?: number }

export default function ListsIndex({ lists }: { lists: List[] }) {
    const form = useForm({ name: '', description: '', isPublic: true });

    return (
        <AppLayout title="My Lists">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">My Lists</h1>

                <form onSubmit={(e) => { e.preventDefault(); form.post('/lists'); }} className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
                    <h2 className="font-semibold text-white">Create New List</h2>
                    <input type="text" placeholder="List name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm" required />
                    <textarea placeholder="Description (optional)" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)}
                        rows={2} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm resize-none" />
                    <button type="submit" disabled={form.processing} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                        Create
                    </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {lists.map((list) => (
                        <Link key={list.id} href={`/lists/${list.id}`}
                            className="bg-gray-900 border border-gray-700 hover:border-indigo-500 rounded-xl p-5 transition-colors group">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{list.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${list.isPublic ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                                    {list.isPublic ? 'Public' : 'Private'}
                                </span>
                            </div>
                            {list.description && <p className="text-sm text-gray-400 line-clamp-2">{list.description}</p>}
                            {list.itemCount !== undefined && <p className="text-xs text-gray-500 mt-2">{list.itemCount} items</p>}
                        </Link>
                    ))}
                    {lists.length === 0 && (
                        <div className="col-span-3 text-center py-10 text-gray-500">No lists yet. Create your first one!</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
