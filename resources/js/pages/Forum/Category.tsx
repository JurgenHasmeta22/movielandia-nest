import { Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface Topic { id: number; title: string; postCount: number; viewCount: number; createdAt: string; user: { userName: string } }
interface Category { id: number; name: string; description: string | null }

export default function ForumCategory({ category, topics }: { category: Category; topics: { topics: Topic[]; pagination: any } }) {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;
    const form = useForm({ title: '', categoryId: category.id, content: '' });

    return (
        <AppLayout title={category.name}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/forum" className="text-sm text-indigo-400 hover:text-indigo-300 mb-2 inline-block">← Forum</Link>
                        <h1 className="text-3xl font-bold text-white">{category.name}</h1>
                        {category.description && <p className="text-gray-400 mt-1">{category.description}</p>}
                    </div>
                </div>

                {auth.user && (
                    <form onSubmit={(e) => { e.preventDefault(); form.post('/forum/topics'); }} className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
                        <h3 className="font-semibold text-white">Create New Topic</h3>
                        <input type="hidden" {...form} name="categoryId" value={category.id} />
                        <input type="text" placeholder="Topic title" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm" required />
                        <button type="submit" disabled={form.processing} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                            Create Topic
                        </button>
                    </form>
                )}

                <div className="space-y-3">
                    {topics.topics?.map((topic) => (
                        <Link key={topic.id} href={`/forum/topics/${topic.id}`}
                            className="flex items-center gap-4 bg-gray-900 border border-gray-700 hover:border-indigo-500 rounded-xl p-4 transition-colors group">
                            <div className="flex-1">
                                <h3 className="font-medium text-white group-hover:text-indigo-300 transition-colors">{topic.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">by {topic.user.userName} · {new Date(topic.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-4 text-xs text-gray-500">
                                <span>💬 {topic.postCount ?? 0}</span>
                                <span>👁 {topic.viewCount ?? 0}</span>
                            </div>
                        </Link>
                    ))}
                    {(!topics.topics || topics.topics.length === 0) && (
                        <p className="text-gray-500 text-center py-10">No topics yet. Start the conversation!</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
