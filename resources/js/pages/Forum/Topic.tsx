import { useForm, usePage, Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface Post { id: number; content: string; createdAt: string; user: { userName: string; avatar: string | null } }
interface Topic { id: number; title: string; category: { id: number; name: string }; user: { userName: string } }

export default function ForumTopic({ topic, posts }: { topic: Topic; posts: { posts: Post[]; pagination: any } }) {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;
    const form = useForm({ topicId: topic.id, content: '' });

    return (
        <AppLayout title={topic.title}>
            <div className="space-y-6">
                <div>
                    <Link href={`/forum/categories/${topic.category.id}`} className="text-sm text-indigo-400 hover:text-indigo-300 mb-1 inline-block">
                        ← {topic.category.name}
                    </Link>
                    <h1 className="text-2xl font-bold text-white">{topic.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">by {topic.user.userName}</p>
                </div>

                <div className="space-y-4">
                    {posts.posts?.map((post) => (
                        <div key={post.id} className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-sm font-bold text-indigo-200">
                                        {post.user.userName[0].toUpperCase()}
                                    </div>
                                    <span className="font-medium text-gray-200">{post.user.userName}</span>
                                </div>
                                <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        </div>
                    ))}
                </div>

                {auth.user && (
                    <form onSubmit={(e) => { e.preventDefault(); form.post('/forum/posts'); }} className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
                        <h3 className="font-semibold text-white">Post a Reply</h3>
                        <textarea value={form.data.content} onChange={(e) => form.setData('content', e.target.value)}
                            rows={4} placeholder="Write your reply…"
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm resize-none" required />
                        <button type="submit" disabled={form.processing} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                            {form.processing ? 'Posting…' : 'Post Reply'}
                        </button>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
