import { Link, router } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";
import { MediaGrid } from "../../components/MediaGrid";
import { SortControls } from "../../components/SortControls";
import { PaginationBar } from "../../components/PaginationBar";
import type { Pagination, SortFilters } from "../../types/media";

interface Genre {
    id: number;
    name: string;
    description?: string | null;
    movies?: Array<{ id: number; title: string; photoSrc?: string | null; releaseYear?: number | null; ratingImdb?: number | null }>;
    series?: Array<{ id: number; title: string; photoSrc?: string | null; releaseYear?: number | null; ratingImdb?: number | null }>;
    moviesPagination?: Pagination;
    seriesPagination?: Pagination;
    _count?: { movies: number; series: number };
}

interface Props {
    genre: Genre;
    filters?: SortFilters;
}

const SORT_OPTIONS = [
    { value: 'title', label: 'Title' },
    { value: 'dateAired', label: 'Release Year' },
    { value: 'ratingImdb', label: 'IMDb Rating' },
];

export default function GenresShow({ genre, filters = {} }: Props) {
    const sortBy = filters.sortBy ?? 'title';
    const ascOrDesc = filters.ascOrDesc ?? 'asc';
    const perPage = filters.perPage ?? 12;

    const moviesPag = genre.moviesPagination;
    const seriesPag = genre.seriesPagination;

    const navigate = (overrides: Record<string, string | number | undefined>) =>
        router.get(`/genres/${genre.id}`, {
            sortBy, ascOrDesc, perPage,
            moviesPage: moviesPag?.page ?? 1,
            seriesPage: seriesPag?.page ?? 1,
            ...overrides,
        }, { preserveScroll: false });

    return (
        <AppLayout title={genre.name}>
            <div className="space-y-10">
                {/* Header */}
                <div>
                    <Link href="/genres" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                        &larr; All Genres
                    </Link>
                    <h1 className="text-4xl font-bold text-white mt-2 capitalize">{genre.name}</h1>
                    {genre.description && (
                        <p className="text-gray-300 mt-3 max-w-3xl">{genre.description}</p>
                    )}
                    {genre._count && (
                        <div className="flex gap-4 mt-2 text-sm text-gray-400">
                            <span>{genre._count.movies.toLocaleString()} movies</span>
                            <span>{genre._count.series.toLocaleString()} series</span>
                        </div>
                    )}
                </div>

                {/* Sort controls */}
                <SortControls
                    sortBy={sortBy}
                    ascOrDesc={ascOrDesc}
                    perPage={perPage}
                    sortOptions={SORT_OPTIONS}
                    label="Sort by:"
                    onSortChange={(s) => navigate({
                        sortBy: s,
                        ascOrDesc: s === sortBy && ascOrDesc === 'asc' ? 'desc' : 'asc',
                        moviesPage: 1, seriesPage: 1,
                    })}
                    onOrderChange={(o) => navigate({ ascOrDesc: o, moviesPage: 1, seriesPage: 1 })}
                    onPerPageChange={(p) => navigate({ perPage: Number(p), moviesPage: 1, seriesPage: 1 })}
                />

                {/* Movies */}
                {(genre.movies ?? []).length > 0 ? (
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Movies
                            {moviesPag && (
                                <span className="text-gray-400 text-base font-normal ml-2">
                                    ({moviesPag.total.toLocaleString()} total)
                                </span>
                            )}
                        </h2>
                        <MediaGrid items={genre.movies ?? []} type="movies" />
                        <PaginationBar
                            pagination={moviesPag!}
                            onPageChange={(p) => navigate({ moviesPage: p })}
                        />
                    </section>
                ) : (
                    genre._count?.movies === 0 && (
                        <p className="text-gray-500">No movies in this genre.</p>
                    )
                )}

                {/* Series */}
                {(genre.series ?? []).length > 0 ? (
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Series
                            {seriesPag && (
                                <span className="text-gray-400 text-base font-normal ml-2">
                                    ({seriesPag.total.toLocaleString()} total)
                                </span>
                            )}
                        </h2>
                        <MediaGrid items={genre.series ?? []} type="series" />
                        <PaginationBar
                            pagination={seriesPag!}
                            onPageChange={(p) => navigate({ seriesPage: p })}
                        />
                    </section>
                ) : (
                    genre._count?.series === 0 && (
                        <p className="text-gray-500">No series in this genre.</p>
                    )
                )}
            </div>
        </AppLayout>
    );
}
