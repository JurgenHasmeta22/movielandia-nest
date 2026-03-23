import { useForm, usePage, Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Post { id: number; content: string; createdAt: string; user: { userName: string; avatar: string | null } }
interface Topic { id: number; title: string; category: { id: number; name: string }; user: { userName: string } }

export default function ForumTopic({ topic, posts }: { topic: Topic; posts: { posts: Post[]; pagination: any } }) {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;
    const form = useForm({ topicId: topic.id, content: '' });

    return (
        <AppLayout title={topic.title}>
            <div className="space-y-6">
                <div>
                    <Link href={`/forum/categories/${topic.category.id}`} className="text-sm text-primary hover:text-primary/80 mb-1 inline-block">
                        ← {topic.category.name}
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">{topic.title}</h1>
                    <p className="text-sm text-muted-foreground mt-1">by {topic.user.userName}</p>
                </div>

                <div className="space-y-4">
                    {posts.posts?.map((post) => (
                        <Card key={post.id}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-sm font-bold text-primary">
                                            {post.user.userName[0].toUpperCase()}
                                        </div>
                                        <span className="font-medium text-foreground">{post.user.userName}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {auth.user && (
                    <Card>
                        <CardContent className="p-5 space-y-3">
                            <h3 className="font-semibold text-foreground">Post a Reply</h3>
                            <form onSubmit={(e) => { e.preventDefault(); form.post('/forum/posts'); }} className="space-y-3">
                                <Textarea
                                    value={form.data.content}
                                    onChange={(e) => form.setData('content', e.target.value)}
                                    rows={4}
                                    placeholder="Write your reply…"
                                    required
                                />
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing ? 'Posting…' : 'Post Reply'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
