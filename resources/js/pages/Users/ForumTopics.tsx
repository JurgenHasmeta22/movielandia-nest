import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface ForumTopic {
    id: number;
    title: string;
    createdAt: string;
    category?: { id: number; name: string };
    _count?: { posts: number };
}

interface TopicsPayload {
    items: ForumTopic[];
    total: number;
    page: number;
    perPage: number;
}

interface Props {
    topics: TopicsPayload;
}

export default function UsersForumTopics({ topics }: Props) {
    const items = topics?.items ?? [];

    return (
        <AppLayout title="My Forum Topics">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-6">My Forum Topics</h1>

                {items.length === 0 ? (
                    <p className="text-muted-foreground text-center py-16">No forum topics yet.</p>
                ) : (
                    <div className="space-y-3">
                        {items.map((topic) => (
                            <Link
                                key={topic.id}
                                href={`/forum/topics/${topic.id}`}
                                className="block p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-foreground font-medium">{topic.title}</p>
                                        {topic.category && (
                                            <p className="text-muted-foreground text-sm mt-1">in {topic.category.name}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {topic._count && (
                                            <p className="text-muted-foreground text-sm">{topic._count.posts} posts</p>
                                        )}
                                        <p className="text-muted-foreground text-xs mt-1">
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
