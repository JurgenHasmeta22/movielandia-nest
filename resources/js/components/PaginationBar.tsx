import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

const btnBase =
    'inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium transition-colors';
const btnActive = 'bg-indigo-600 text-white';
const btnIdle = 'bg-gray-800 text-gray-300 hover:bg-gray-700';
const btnNav = 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white gap-1 px-3';

export function PaginationBar({ pagination, urlBuilder, onPageChange }: PaginationBarProps) {
    if (pagination.totalPages <= 1) return null;

    const { page, totalPages } = pagination;
    const pageList = pages(pagination);

    // --- Link-based (URL) variant ---
    if (urlBuilder && !onPageChange) {
        return (
            <nav className="flex flex-wrap justify-center items-center gap-1.5 pt-6" aria-label="Pagination">
                {page > 1 && (
                    <Link href={urlBuilder(page - 1)} className={`${btnBase} ${btnNav}`}>
                        <ChevronLeft size={14} /> Prev
                    </Link>
                )}
                {pageList.map((p, idx) =>
                    p === 'gap' ? (
                        <span key={`gap-${idx}`} className="text-gray-600 text-sm px-1">…</span>
                    ) : (
                        <Link
                            key={p}
                            href={urlBuilder(p as number)}
                            className={`${btnBase} ${p === page ? btnActive : btnIdle}`}
                        >
                            {p}
                        </Link>
                    ),
                )}
                {page < totalPages && (
                    <Link href={urlBuilder(page + 1)} className={`${btnBase} ${btnNav}`}>
                        Next <ChevronRight size={14} />
                    </Link>
                )}
            </nav>
        );
    }

    // --- Button-based (callback) variant ---
    return (
        <nav className="flex flex-wrap justify-center items-center gap-1.5 pt-6" aria-label="Pagination">
            {page > 1 && (
                <button onClick={() => onPageChange?.(page - 1)} className={`${btnBase} ${btnNav}`}>
                    <ChevronLeft size={14} /> Prev
                </button>
            )}
            {pageList.map((p, idx) =>
                p === 'gap' ? (
                    <span key={`gap-${idx}`} className="text-gray-600 text-sm px-1">…</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange?.(p as number)}
                        className={`${btnBase} ${p === page ? btnActive : btnIdle}`}
                    >
                        {p}
                    </button>
                ),
            )}
            {page < totalPages && (
                <button onClick={() => onPageChange?.(page + 1)} className={`${btnBase} ${btnNav}`}>
                    Next <ChevronRight size={14} />
                </button>
            )}
        </nav>
    );
}
