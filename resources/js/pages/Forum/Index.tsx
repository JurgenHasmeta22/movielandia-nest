import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

interface Category { id: number; name: string; description: string | null; topicCount?: number }

export default function ForumIndex({ categories }: { categories: Category[] }) {
    return (
        <AppLayout title="Forum">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">Community Forum</h1>
                <div className="space-y-3">
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/forum/categories/${cat.id}`}
                            className="flex items-center gap-4 bg-gray-900 border border-gray-700 hover:border-indigo-500 rounded-xl p-5 transition-colors group">
                            <div className="text-3xl">💬</div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{cat.name}</h3>
                                {cat.description && <p className="text-sm text-gray-400 mt-0.5">{cat.description}</p>}
                            </div>
                            {cat.topicCount !== undefined && (
                                <span className="text-sm text-gray-500">{cat.topicCount} topics</span>
                            )}
                        </Link>
                    ))}
                </div>
                {categories.length === 0 && (
                    <p className="text-gray-500 text-center py-10">No forum categories yet.</p>
                )}
            </div>
        </AppLayout>
    );
}
