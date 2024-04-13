import { lazy } from 'react';

const Main = lazy(() => import('../pages/Main'));
const Emails = lazy(() => import('../components/Emails'));
const ViewEmail = lazy(() => import('../components/ViewEmail'));
const Homepage = lazy(() => import('../components/Homepage/Homepage'));
const InboxPage = lazy(() => import('../pages/InboxPage'));
const ErrorComponent = lazy(() => import('../components/common/ErrorComponent'))
const Logout = lazy(() => import('../Logout'))
const Verify = lazy(() => import('../Verify'))

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
    },
    logout: {
        path: '/logout',
        element: Logout
    },
    verify: {
        path: '/verify',
        element: Verify
    }

}

export { routes };