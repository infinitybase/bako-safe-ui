import { Flex } from 'bako-ui';
import { Outlet } from 'react-router-dom';

import { Container } from '@/layouts/dashboard/container';
import { Content } from '@/layouts/dashboard/content';
import { Header } from '@/layouts/dashboard/header';
import { CreateContactDialog } from '@/modules/addressBook';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { Sidebar } from './sidebar';

interface VaultDashboardLayoutProps {
  children?: React.ReactNode;
}

const VaultDashboardLayout = (props: VaultDashboardLayoutProps) => {
  const {
    screenSizes: { vaultRequiredSizeToColumnLayout },
    addressBookInfos: {
      dialog: { contactDialog },
      requests: { createContactRequest },
      form: contactForm,
    },
  } = useWorkspaceContext();

  return (
    <Container>
      <Header />
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isPending}
        isEdit={false}
      />
      <Flex w="100%" flex={1}>
        {!vaultRequiredSizeToColumnLayout && <Sidebar />}
        <Content>{props.children}</Content>
      </Flex>
    </Container>
  );
};

const VaultDashboardLayoutRouter = () => {
  return (
    <VaultDashboardLayout>
      <Outlet />
    </VaultDashboardLayout>
  );
};

export { VaultDashboardLayout, VaultDashboardLayoutRouter };
