import { Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

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
                        <Link href="/forum" className="text-sm text-primary hover:text-primary/80 mb-2 inline-block">← Forum</Link>
                        <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
                        {category.description && <p className="text-muted-foreground mt-1">{category.description}</p>}
                    </div>
                </div>

                {auth.user && (
                    <Card>
                        <CardContent className="p-5 space-y-3">
                            <h3 className="font-semibold text-foreground">Create New Topic</h3>
                            <form onSubmit={(e) => { e.preventDefault(); form.post('/forum/topics'); }} className="space-y-3">
                                <input type="hidden" {...form} name="categoryId" value={category.id} />
                                <Input type="text" placeholder="Topic title" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} required />
                                <Button type="submit" disabled={form.processing}>Create Topic</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-3">
                    {topics.topics?.map((topic) => (
                        <Link key={topic.id} href={`/forum/topics/${topic.id}`}
                            className="flex items-center gap-4 bg-card border border-border hover:border-primary rounded-xl p-4 transition-colors group">
                            <div className="flex-1">
                                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{topic.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">by {topic.user.userName} · {new Date(topic.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>💬 {topic.postCount ?? 0}</span>
                                <span>👁 {topic.viewCount ?? 0}</span>
                            </div>
                        </Link>
                    ))}
                    {(!topics.topics || topics.topics.length === 0) && (
                        <p className="text-muted-foreground text-center py-10">No topics yet. Start the conversation!</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
