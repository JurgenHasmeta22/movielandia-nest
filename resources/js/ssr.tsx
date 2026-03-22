/// <reference types="vite/client" />
import type { ComponentType } from 'react';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';

type PageModule = {
    default: ComponentType<Record<string, unknown>>;
};

const appName = 'Movielandia24';
const pages = import.meta.glob<PageModule>('./pages/**/*.tsx');

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),

        resolve: async (name) => {
            const pageModule = pages[`./pages/${name}.tsx`];
            if (!pageModule) throw new Error(`SSR page not found: ${name}`);
            const module = await pageModule();
            return module.default;
        },

        setup: ({ App, props }) => <App {...props} />,
    }),
);
