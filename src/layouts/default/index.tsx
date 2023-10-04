import React from 'react';
import { Outlet } from 'react-router-dom';

import { Container } from './container';
import { Content } from './content';
import { Header } from './header';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = (props: DefaultLayoutProps) => {
  return (
    <DefaultLayout.Container>
      <DefaultLayout.Header />
      <DefaultLayout.Content>{props.children}</DefaultLayout.Content>
    </DefaultLayout.Container>
  );
};

const DefaultLayoutRouter = () => (
  <DefaultLayout>
    <Outlet />
  </DefaultLayout>
);

DefaultLayout.Header = Header;
DefaultLayout.Content = Content;
DefaultLayout.Container = Container;

export { DefaultLayout, DefaultLayoutRouter };
