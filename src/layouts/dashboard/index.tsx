import React from 'react';
import { Outlet } from 'react-router-dom';

import { Container } from './container';
import { Header } from './header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = (props: DashboardLayoutProps) => {
  return (
    <DashboardLayout.Container>
      <DashboardLayout.Header />
      {props.children}
    </DashboardLayout.Container>
  );
};

const DashboardLayoutRouter = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

DashboardLayout.Header = Header;
DashboardLayout.Container = Container;

export { DashboardLayout, DashboardLayoutRouter };
