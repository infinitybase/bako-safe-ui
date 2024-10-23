import { Flex } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from '../../modules/vault/layout/sidebar';
import { Container } from './container';
import { Content } from './content';
import { Drawer } from './drawer';
import { Header } from './header';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = (props: DashboardLayoutProps) => {
  return (
    <DashboardLayout.Container>
      <DashboardLayout.Header />
      <Flex w="100%" flex={1}>
        <DashboardLayout.Content>{props.children}</DashboardLayout.Content>
      </Flex>
    </DashboardLayout.Container>
  );
};

const DashboardLayoutRouter = (props: DashboardLayoutProps) => {
  return (
    <DashboardLayout {...props}>
      <Outlet />
    </DashboardLayout>
  );
};

DashboardLayout.Container = Container;
DashboardLayout.Header = Header;
DashboardLayout.Sidebar = Sidebar;
DashboardLayout.Content = Content;
DashboardLayout.Drawer = Drawer;

export { DashboardLayout, DashboardLayoutRouter };
