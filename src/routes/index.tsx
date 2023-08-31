import { BrowserRouter, Routes } from 'react-router-dom';

import { exampleRoutes, homeRoutes, signinRoutes } from '@/modules';

const routes = (
  <>
    {exampleRoutes}
    {signinRoutes}
    {homeRoutes}
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
