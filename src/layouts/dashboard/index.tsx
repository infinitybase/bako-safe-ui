import { Flex } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { useScreenSize } from '@/modules';

import { Container } from './container';
import { Content } from './content';
import { Drawer } from './drawer';
import { Header } from './header';
import { Sidebar } from './sidebar';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  hasSideBar?: boolean;
}

const DashboardLayout = (props: DashboardLayoutProps) => {
  const { isMobile } = useScreenSize();

  return (
    <DashboardLayout.Container>
      <DashboardLayout.Header />
      <Flex w="100%" flex={1}>
        {props.hasSideBar && !isMobile && <DashboardLayout.Sidebar />}
        <DashboardLayout.Content>{props.children}</DashboardLayout.Content>
      </Flex>
    </DashboardLayout.Container>
  );
};

const DashboardLayoutRouter = (props: DashboardLayoutProps) => (
  <DashboardLayout {...props}>
    <Outlet />
  </DashboardLayout>
);

DashboardLayout.Container = Container;
DashboardLayout.Header = Header;
DashboardLayout.Sidebar = Sidebar;
DashboardLayout.Content = Content;
DashboardLayout.Drawer = Drawer;

export { DashboardLayout, DashboardLayoutRouter };
