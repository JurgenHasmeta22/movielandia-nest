import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface ForumTopic {
    id: number;
    title: string;
    createdAt: string;
    category?: { id: number; name: string };
    _count?: { posts: number };
}

interface Props {
    topics: ForumTopic[];
}

export default function UsersForumTopics({ topics }: Props) {
    return (
        <AppLayout title="My Forum Topics">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-6">My Forum Topics</h1>

                {topics.length === 0 ? (
                    <p className="text-gray-400 text-center py-16">No forum topics yet.</p>
                ) : (
                    <div className="space-y-3">
                        {topics.map((topic) => (
                            <Link
                                key={topic.id}
                                href={`/forum/topics/${topic.id}`}
                                className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-white font-medium">{topic.title}</p>
                                        {topic.category && (
                                            <p className="text-gray-400 text-sm mt-1">in {topic.category.name}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {topic._count && (
                                            <p className="text-gray-400 text-sm">{topic._count.posts} posts</p>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1">
                                            {new Date(topic.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
