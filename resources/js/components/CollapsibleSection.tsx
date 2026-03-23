import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
    title: string;
    count?: number;
    defaultOpen?: boolean;
    viewAllHref?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}

export function CollapsibleSection({
    title,
    count,
    defaultOpen = true,
    viewAllHref,
    action,
    children,
}: CollapsibleSectionProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <section className="bg-card/60 border border-border rounded-2xl overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-accent/50 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-foreground">{title}</span>
                    {count !== undefined && (
                        <Badge variant="secondary" className="rounded-full font-normal">
                            {count.toLocaleString()}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {viewAllHref && open && (
                        <a
                            href={viewAllHref}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            View all â†’
                        </a>
                    )}
                    {action}
                    <ChevronDown
                        size={18}
                        className={cn(
                            'text-muted-foreground transition-transform duration-200',
                            open && 'rotate-180',
                        )}
                    />
                </div>
            </button>
            {open && (
                <div className="px-6 pb-6 pt-2">
                    {children}
                </div>
            )}
        </section>
    );
}


interface CollapsibleSectionProps {
    title: string;
    count?: number;
    defaultOpen?: boolean;
    viewAllHref?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}

