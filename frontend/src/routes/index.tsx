import { createBrowserRouter, RouterProvider } from 'react-router';

import Home from '@/pages/Home/Home';
import RoutieSpace from '@/pages/RoutieSpace/RoutieSpace';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/routie-spaces',
    element: <RoutieSpace />,
  },
]);

const Route = () => {
  return <RouterProvider router={router} />;
};

export default Route;
