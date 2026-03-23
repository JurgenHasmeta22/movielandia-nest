import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
    id: number;
    content: string;
    rating: number;
    createdAt: string;
    itemType: 'movie' | 'serie' | 'season' | 'episode' | 'actor' | 'crew';
    itemId: number;
    itemTitle: string;
}

interface ReviewsPayload {
    items: Review[];
    total: number;
    page: number;
    perPage: number;
}

interface Props {
    reviews: ReviewsPayload;
}

export default function UsersReviews({ reviews }: Props) {
    const items = reviews?.items ?? [];

    const getHref = (review: Review) => {
        switch (review.itemType) {
            case 'movie':
                return `/movies/${review.itemId}`;
            case 'serie':
                return `/series/${review.itemId}`;
            case 'season':
                return `/seasons/${review.itemId}`;
            case 'episode':
                return `/episodes/${review.itemId}`;
            case 'actor':
                return `/actors/${review.itemId}`;
            case 'crew':
                return `/crew/${review.itemId}`;
            default:
                return '#';
        }
    };

    return (
        <AppLayout title="My Reviews">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-6">My Reviews</h1>

                {items.length === 0 ? (
                    <p className="text-muted-foreground text-center py-16">No reviews yet.</p>
                ) : (
                    <div className="space-y-4">
                        {items.map((review) => {
                            const href = getHref(review);
                            return (
                                <Card key={review.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <Link href={href} className="text-primary hover:underline font-medium">
                                                {review.itemTitle}
                                            </Link>
                                            <div className="flex items-center gap-2">
                                                <span className="text-yellow-400 font-semibold">★ {review.rating.toFixed(1)}</span>
                                                <span className="text-muted-foreground text-sm">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-foreground/80 text-sm">{review.content}</p>
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
