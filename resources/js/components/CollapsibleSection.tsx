import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
        <section className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-800/50 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-white">{title}</span>
                    {count !== undefined && (
                        <span className="text-sm text-gray-400 bg-gray-800 rounded-full px-2.5 py-0.5 font-normal">
                            {count.toLocaleString()}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {viewAllHref && open && (
                        <a
                            href={viewAllHref}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            View all →
                        </a>
                    )}
                    {action}
                    <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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
