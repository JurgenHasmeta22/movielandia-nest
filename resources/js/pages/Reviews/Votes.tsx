import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface Props {
    reviewId: number;
    voteType: "up" | "down";
    vote?: unknown;
}

export default function ReviewsVotes({ reviewId, voteType, vote }: Props) {
    return (
        <AppLayout title="Review Vote">
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="w-full max-w-sm bg-gray-800 rounded-2xl p-8 text-center">
                    <div className={`w-16 h-16 ${voteType === "up" ? "bg-green-900/30" : "bg-red-900/30"} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <span className={`text-3xl ${voteType === "up" ? "text-green-400" : "text-red-400"}`}>
                            {voteType === "up" ? "👍" : "👎"}
                        </span>
                    </div>
                    <h1 className="text-xl font-bold text-white mb-2">
                        Vote {voteType === "up" ? "Upvoted" : "Downvoted"}
                    </h1>
                    <p className="text-gray-400 mb-6">Your vote has been recorded.</p>
                    <Link href="/" className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
                        Go Home
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
