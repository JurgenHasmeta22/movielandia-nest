import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";

interface Serie {
    id: number;
    title: string;
    photoSrc?: string;
    releaseYear?: number;
    averageRating?: number;
}

interface Props {
    series: Serie[];
}

export default function SeriesLatest({ series }: Props) {
    return (
        <AppLayout title="Latest Series">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-6">Latest Series</h1>
                {series.length === 0 ? (
                    <p className="text-muted-foreground text-center py-16">No series yet.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {series.map((serie) => (
                            <Link key={serie.id} href={`/series/${serie.id}`} className="group block">
                                <Card className="overflow-hidden border-border hover:border-primary transition-colors">
                                    <img
                                        src={serie.photoSrc || "/images/placeholder.jpg"}
                                        alt={serie.title}
                                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <CardContent className="p-2">
                                        <p className="text-foreground text-sm font-medium truncate">{serie.title}</p>
                                        {serie.releaseYear && <p className="text-muted-foreground text-xs">{serie.releaseYear}</p>}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
