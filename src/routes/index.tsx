import { BrowserRouter, Routes } from 'react-router-dom';

import { exampleRoutes, signinRoutes } from '@/modules';

const routes = (
  <>
    {exampleRoutes}
    {signinRoutes}
  </>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>{routes}</Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
