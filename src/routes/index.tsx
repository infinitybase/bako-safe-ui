import { useEffect } from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';

import {
  exampleRoutes,
  homeRoutes,
  signinRoutes,
  useFuelConnection,
  vaultRoutes,
} from '@/modules';

const routes = (
  <>
    {exampleRoutes}
    {signinRoutes}
    {homeRoutes}
    {vaultRoutes}
  </>
);

const AppRoutes = () => {
  const { connect } = useFuelConnection();

  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <BrowserRouter>
      <Routes>{routes}</Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
