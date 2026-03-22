import { Link, useForm } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface Message {
    id: number;
    content: string;
    createdAt: string;
    sender?: { id: number; userName: string; avatar?: { photoSrc: string } | null };
    receiver?: { id: number; userName: string; avatar?: { photoSrc: string } | null };
}

interface Props {
    messages: Message[];
    box: "inbox" | "sent";
}

export default function UsersMessages({ messages, box }: Props) {
    return (
        <AppLayout title="Messages">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-white">Messages</h1>
                    <div className="flex gap-2">
                        <Link
                            href="/users/messages/inbox"
                            className={`px-4 py-2 rounded-lg text-sm ${box === "inbox" ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                        >
                            Inbox
                        </Link>
                        <Link
                            href="/users/messages/sent"
                            className={`px-4 py-2 rounded-lg text-sm ${box === "sent" ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                        >
                            Sent
                        </Link>
                    </div>
                </div>

                {messages.length === 0 ? (
                    <p className="text-gray-400 text-center py-16">No messages in {box}.</p>
                ) : (
                    <div className="space-y-3">
                        {messages.map((msg) => {
                            const contact = box === "inbox" ? msg.sender : msg.receiver;
                            return (
                                <div key={msg.id} className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg">
                                    <img
                                        src={contact?.avatar?.photoSrc || "/images/placeholder.jpg"}
                                        alt={contact?.userName || ""}
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-white font-medium">{contact?.userName}</p>
                                            <p className="text-gray-500 text-xs">
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="text-gray-300 text-sm">{msg.content}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
