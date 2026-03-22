import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

/**
 * Wraps page content with a CSS-driven enter animation on every Inertia navigation.
 * Uses `usePage().component` as the React key — when the key changes React remounts
 * the element from scratch, which re-fires the CSS animation.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
    const { component } = usePage();
    
    return (
        <div key={component} className={`page-transition-enter${className ? ` ${className}` : ''}`}>
            {children}
        </div>
    );
}
