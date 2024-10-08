import { Suspense, lazy } from 'react';
import { Navigate, Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { routes } from "./routes/routes";
import SuspenseLoader from './components/common/SuspenseLoader';
import Check from './Check';

const ErrorComponent = lazy(() => import('./components/common/ErrorComponent'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={routes.main.path} element={<Navigate to={routes.homepage.path} />} />
      <Route path={routes.homepage.path} element={<routes.homepage.element />} />
      <Route path={routes.main.path} element={<routes.main.element />} >
        <Route path={`${routes.emails.path}/:type`} element={<Check/>} errorElement={<ErrorComponent />} />
        <Route path={`${routes.emails.path}`} element={<Check/>} errorElement={<ErrorComponent />} />
        <Route path={routes.view.path} element={<routes.view.element />} errorElement={<ErrorComponent />} />
        <Route path={routes.delete.path} element={<routes.delete.element />} errorElement={<ErrorComponent />} />
      </Route>
      <Route path={routes.invalid.path} element={<ErrorComponent />} />
      <Route path={routes.logout.path} element={<routes.logout.element/>}/>
    </Route>

  )
)

function App() {
  return (
    <Suspense fallback={<SuspenseLoader />}>

        <RouterProvider router={router} />          

    </Suspense>
  );
}

export default App;
