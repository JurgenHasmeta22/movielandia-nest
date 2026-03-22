/// <reference types="vite/client" />
import type { ComponentType } from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

type PageModule = {
    default: ComponentType<Record<string, unknown>>;
};

const appName = 'Movielandia24';
const pages = import.meta.glob<PageModule>('./pages/**/*.tsx');

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: async (name) => {
        const page = pages[`./pages/${name}.tsx`];

        if (!page) throw new Error(`Page not found: ${name}`);

        const module = await page();
        
        return module.default;
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: '#6366f1',
    },
});
