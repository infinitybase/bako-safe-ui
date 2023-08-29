import { BrowserRouter, Routes } from 'react-router-dom';

import { exampleRoutes } from '@/modules/example';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>{exampleRoutes}</Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
