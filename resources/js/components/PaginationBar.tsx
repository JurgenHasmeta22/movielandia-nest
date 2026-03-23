import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import type { Pagination } from '../types/media';

interface PaginationBarProps {
    pagination: Pagination;
    /** Build a URL for a given page number — used for `<Link>` based navigation */
    urlBuilder?: (page: number) => string;
    /** Callback for button-based navigation (e.g. inside Genres/Show) */
    onPageChange?: (page: number) => void;
}

function pages(pagination: Pagination): (number | 'gap')[] {
    const { page, totalPages } = pagination;
    return Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
        .reduce<(number | 'gap')[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('gap');
            acc.push(p);
            return acc;
        }, []);
}

export function PaginationBar({ pagination, urlBuilder, onPageChange }: PaginationBarProps) {
    if (pagination.totalPages <= 1) return null;

    const { page, totalPages } = pagination;
    const pageList = pages(pagination);

    // --- Link-based (URL) variant ---
    if (urlBuilder && !onPageChange) {
        return (
            <nav className="flex flex-wrap justify-center items-center gap-1.5 pt-6" aria-label="Pagination">
                {page > 1 && (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={urlBuilder(page - 1)}>
                            <ChevronLeft size={14} /> Prev
                        </Link>
                    </Button>
                )}
                {pageList.map((p, idx) =>
                    p === 'gap' ? (
                        <span key={`gap-${idx}`} className="text-muted-foreground text-sm px-1">…</span>
                    ) : (
                        <Button
                            key={p}
                            variant={p === page ? 'default' : 'outline'}
                            size="sm"
                            asChild
                        >
                            <Link href={urlBuilder(p as number)}>{p}</Link>
                        </Button>
                    ),
                )}
                {page < totalPages && (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={urlBuilder(page + 1)}>
                            Next <ChevronRight size={14} />
                        </Link>
                    </Button>
                )}
            </nav>
        );
    }

    // --- Button-based (callback) variant ---
    return (
        <nav className="flex flex-wrap justify-center items-center gap-1.5 pt-6" aria-label="Pagination">
            {page > 1 && (
                <Button variant="outline" size="sm" onClick={() => onPageChange?.(page - 1)}>
                    <ChevronLeft size={14} /> Prev
                </Button>
            )}
            {pageList.map((p, idx) =>
                p === 'gap' ? (
                    <span key={`gap-${idx}`} className="text-muted-foreground text-sm px-1">…</span>
                ) : (
                    <Button
                        key={p}
                        variant={p === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange?.(p as number)}
                    >
                        {p}
                    </Button>
                ),
            )}
            {page < totalPages && (
                <Button variant="outline" size="sm" onClick={() => onPageChange?.(page + 1)}>
                    Next <ChevronRight size={14} />
                </Button>
            )}
        </nav>
    );
}
