import { lazy } from 'react';

const Main = lazy(() => import('../pages/Main'));
const Emails = lazy(() => import('../components/Emails'));
const ViewEmail = lazy(() => import('../components/ViewEmail'));
const Deleted = lazy(() => import('../components/Deleted'));
const Homepage = lazy(() => import('../components/Homepage/Homepage'));
const Logout = lazy(() => import('../Logout'))

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
    delete: {
        path: '/deleted',
        element: Deleted
    },
    homepage: {
        path: '/home',
        element: Homepage
    },
    logout: {
        path: '/logout',
        element: Logout
    }
}

export { routes };