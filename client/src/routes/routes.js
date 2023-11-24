import { lazy } from 'react';

const Main = lazy(() => import('../pages/Main'));
const Emails = lazy(() => import('../components/Emails'));
const ViewEmail = lazy(() => import('../components/ViewEmail'));
const Homepage = lazy(() => import('../components/Homepage/Homepage'));

const routes = {
    main: {
        path: '/',
        element: Main
    },
    emails: {
        path: '/emails',
        element: Emails
    },
    invalid: {
        path: '/*',
        element: Emails
    },
    view: {
        path: '/view',
        element: ViewEmail
    },
    homepage: {
        path: '/home',
        element: Homepage
    }
}

export { routes };