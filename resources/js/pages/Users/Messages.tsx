import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
    id: number;
    text: string;
    createdAt: string;
    sender?: { id: number; userName: string; avatar?: string | null };
    receiver?: { id: number; userName: string; avatar?: string | null };
}

interface MessagesPayload {
    items: Message[];
    total: number;
    page: number;
    perPage: number;
}

interface Props {
    messages: MessagesPayload;
    box: "inbox" | "sent";
}

export default function UsersMessages({ messages, box }: Props) {
    const items = messages?.items ?? [];

    const resolveAvatar = (avatar?: string | null) => {
        if (!avatar) return '/images/placeholder.jpg';
        if (avatar.startsWith('http')) return avatar;
        return `/images/users/${avatar}`;
    };

    return (
        <AppLayout title="Messages">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Messages</h1>
                    <div className="flex gap-2">
                        <Button variant={box === "inbox" ? "default" : "outline"} size="sm" asChild>
                            <Link href="/users/messages/inbox">Inbox</Link>
                        </Button>
                        <Button variant={box === "sent" ? "default" : "outline"} size="sm" asChild>
                            <Link href="/users/messages/sent">Sent</Link>
                        </Button>
                    </div>
                </div>

                {items.length === 0 ? (
                    <p className="text-muted-foreground text-center py-16">No messages in {box}.</p>
                ) : (
                    <div className="space-y-3">
                        {items.map((msg) => {
                            const contact = box === "inbox" ? msg.sender : msg.receiver;
                            return (
                                <Card key={msg.id}>
                                    <CardContent className="p-4 flex items-start gap-4">
                                        <img
                                            src={resolveAvatar(contact?.avatar)}
                                            alt={contact?.userName || ""}
                                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-foreground font-medium">{contact?.userName}</p>
                                                <p className="text-muted-foreground text-xs">
                                                    {new Date(msg.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <p className="text-foreground/80 text-sm">{msg.text}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
