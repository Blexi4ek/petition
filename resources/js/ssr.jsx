import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import ReactDOMServer from 'react-dom/server'

import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {route} from "ziggy-js";
import { Ziggy } from '@/ziggy'

createServer(page =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: name => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup: ({ App, props }) => {
        

        // Set global function route
        global.route = (name, params, absolute, config = Ziggy) => route(name, params, absolute, config);

        return <App {...props} />
    },
    progress: {
        color: '#4B5563',
    },
  }),
)