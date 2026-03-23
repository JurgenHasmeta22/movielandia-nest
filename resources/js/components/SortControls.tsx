import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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
    return (
        <div className="flex flex-wrap items-center gap-3">
            {label && <span className="text-muted-foreground text-sm">{label}</span>}

            {/* Sort field */}
            <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-[160px]">
                    <ArrowUpDown size={14} className="mr-1.5 text-muted-foreground" />
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {sortOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Asc / Desc toggle */}
            <div className="flex rounded-md overflow-hidden border border-border">
                <Button
                    variant={ascOrDesc === 'asc' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onOrderChange('asc')}
                    title="Ascending"
                    className="rounded-none"
                >
                    <ArrowUp size={13} /> Asc
                </Button>
                <Button
                    variant={ascOrDesc === 'desc' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onOrderChange('desc')}
                    title="Descending"
                    className="rounded-none"
                >
                    <ArrowDown size={13} /> Desc
                </Button>
            </div>

            {/* Per page */}
            <Select value={String(perPage)} onValueChange={onPerPageChange}>
                <SelectTrigger className="w-[110px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {perPageOptions.map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
