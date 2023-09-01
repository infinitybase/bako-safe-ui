import React from 'react';

import { Container } from './container.tsx';
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

DefaultLayout.Header = Header;
DefaultLayout.Content = Content;
DefaultLayout.Container = Container;

export { DefaultLayout };
