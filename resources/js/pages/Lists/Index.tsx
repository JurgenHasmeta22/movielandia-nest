import { Link, useForm } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface List { id: number; name: string; description: string | null; isPublic: boolean; itemCount?: number }

export default function ListsIndex({ lists }: { lists: List[] }) {
    const form = useForm({ name: '', description: '', isPublic: true });

    return (
        <AppLayout title="My Lists">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-foreground">My Lists</h1>

                <Card>
                    <CardContent className="p-5 space-y-3">
                        <h2 className="font-semibold text-foreground">Create New List</h2>
                        <form onSubmit={(e) => { e.preventDefault(); form.post('/lists'); }} className="space-y-3">
                            <Input type="text" placeholder="List name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} required />
                            <Textarea placeholder="Description (optional)" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} rows={2} />
                            <Button type="submit" disabled={form.processing}>Create</Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {lists.map((list) => (
                        <Link key={list.id} href={`/lists/${list.id}`} className="group">
                            <Card className="border-border hover:border-primary transition-colors h-full">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{list.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${list.isPublic ? 'bg-green-900/50 text-green-300' : 'bg-muted text-muted-foreground'}`}>
                                            {list.isPublic ? 'Public' : 'Private'}
                                        </span>
                                    </div>
                                    {list.description && <p className="text-sm text-muted-foreground line-clamp-2">{list.description}</p>}
                                    {list.itemCount !== undefined && <p className="text-xs text-muted-foreground mt-2">{list.itemCount} items</p>}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {lists.length === 0 && (
                        <div className="col-span-3 text-center py-10 text-muted-foreground">No lists yet. Create your first one!</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
