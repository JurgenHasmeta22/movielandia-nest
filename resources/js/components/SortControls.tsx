import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export interface SortOption {
    value: string;
    label: string;
}

interface SortControlsProps {
    sortBy: string;
    ascOrDesc: string;
    perPage: number;
    sortOptions: SortOption[];
    perPageOptions?: number[];
    onSortChange: (sortBy: string) => void;
    onOrderChange: (order: string) => void;
    onPerPageChange: (perPage: string) => void;
    label?: string;
}

export function SortControls({
    sortBy,
    ascOrDesc,
    perPage,
    sortOptions,
    perPageOptions = [12, 24, 48],
    onSortChange,
    onOrderChange,
    onPerPageChange,
    label,
}: SortControlsProps) {
    const selectCls =
        'bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer';

    return (
        <div className="flex flex-wrap items-center gap-3">
            {label && <span className="text-gray-400 text-sm">{label}</span>}

            {/* Sort field */}
            <div className="relative flex items-center gap-1.5">
                <ArrowUpDown size={14} className="text-gray-400 absolute left-2.5 pointer-events-none" />
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className={`${selectCls} pl-8`}
                >
                    {sortOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* Asc / Desc toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
                <button
                    onClick={() => onOrderChange('asc')}
                    title="Ascending"
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                        ascOrDesc === 'asc' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    <ArrowUp size={13} /> Asc
                </button>
                <button
                    onClick={() => onOrderChange('desc')}
                    title="Descending"
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                        ascOrDesc === 'desc' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    <ArrowDown size={13} /> Desc
                </button>
            </div>

            {/* Per page */}
            <select
                value={perPage}
                onChange={(e) => onPerPageChange(e.target.value)}
                className={selectCls}
            >
                {perPageOptions.map((n) => (
                    <option key={n} value={n}>{n} / page</option>
                ))}
            </select>
        </div>
    );
}
