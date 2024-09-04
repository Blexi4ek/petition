import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const stripePromise = loadStripe('pk_test_51PuW7VGTLFfQp8wwbixWqKwv744exZ8qNfMZYeIjGdCP0xUXbQ69eIz9BEp0ao5jVPCojdIS5YUZVdVyqfqaDqMg00iA89KEq2');
        const options = {
            // passing the client secret obtained from the server
            clientSecret: 'pi_3MtwBwLkdIwHu7ix28a3tqPa_secret_YrKJUKribcBjcG8HVhfZluoGH',
          };
        const root = createRoot(el);

        root.render(<Elements stripe={stripePromise} >
           <App {...props} /> </Elements>);
    },
    progress: {
        color: '#4B5563',
    },
});
