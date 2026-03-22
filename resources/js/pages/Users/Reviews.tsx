import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface Review {
    id: number;
    content: string;
    rating?: number;
    createdAt: string;
    movie?: { id: number; title: string; photoSrc?: string };
    serie?: { id: number; title: string; photoSrc?: string };
    episode?: { id: number; title: string };
}

interface Props {
    reviews: Review[];
}

export default function UsersReviews({ reviews }: Props) {
    return (
        <AppLayout title="My Reviews">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-6">My Reviews</h1>

                {reviews.length === 0 ? (
                    <p className="text-gray-400 text-center py-16">No reviews yet.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => {
                            const subject = review.movie || review.serie || review.episode;
                            const href = review.movie
                                ? `/movies/${review.movie.id}`
                                : review.serie
                                ? `/series/${review.serie.id}`
                                : review.episode
                                ? `/episodes/${review.episode.id}`
                                : "#";
                            return (
                                <div key={review.id} className="p-4 bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <Link href={href} className="text-indigo-400 hover:underline font-medium">
                                            {(subject as any)?.title}
                                        </Link>
                                        <div className="flex items-center gap-2">
                                            {review.rating != null && (
                                                <span className="text-yellow-400 font-semibold">★ {review.rating.toFixed(1)}</span>
                                            )}
                                            <span className="text-gray-500 text-sm">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm">{review.content}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
