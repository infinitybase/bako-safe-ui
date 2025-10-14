import { Flex } from 'bako-ui';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { CreateContactDialog } from '@/modules';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { Sidebar } from '../../modules/vault/layout/sidebar';
import { Container } from './container';
import { Content } from './content';
import { Drawer } from './drawer';
import { Header } from './header';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = (props: DashboardLayoutProps) => {
  const {
    addressBookInfos: {
      dialog: { contactDialog },
      requests: { createContactRequest },
      form: contactForm,
    },
  } = useWorkspaceContext();

  return (
    <DashboardLayout.Container>
      <DashboardLayout.Header />
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isPending}
        isEdit={false}
      />
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
