import { Link } from '@inertiajs/react';
import type { Pagination } from '../types/media';
import {
    Pagination as PaginationRoot,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './ui/pagination';

interface PaginationBarProps {
    pagination: Pagination;
    /** Build a URL for a given page number â€” used for `<Link>` based navigation */
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
            <PaginationRoot className="pt-6">
                <PaginationContent>
                    {page > 1 && (
                        <PaginationItem>
                            <PaginationPrevious href={urlBuilder(page - 1)} />
                        </PaginationItem>
                    )}
                    {pageList.map((p, idx) =>
                        p === 'gap' ? (
                            <PaginationItem key={`gap-${idx}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={p}>
                                <PaginationLink href={urlBuilder(p as number)} isActive={p === page}>
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ),
                    )}
                    {page < totalPages && (
                        <PaginationItem>
                            <PaginationNext href={urlBuilder(page + 1)} />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </PaginationRoot>
        );
    }

    // --- Button-based (callback) variant ---
    return (
        <PaginationRoot className="pt-6">
            <PaginationContent>
                {page > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => { e.preventDefault(); onPageChange?.(page - 1); }}
                        />
                    </PaginationItem>
                )}
                {pageList.map((p, idx) =>
                    p === 'gap' ? (
                        <PaginationItem key={`gap-${idx}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href="#"
                                isActive={p === page}
                                onClick={(e) => { e.preventDefault(); onPageChange?.(p as number); }}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ),
                )}
                {page < totalPages && (
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => { e.preventDefault(); onPageChange?.(page + 1); }}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </PaginationRoot>
    );
}

