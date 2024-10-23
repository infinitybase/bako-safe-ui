import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import { Container } from '@/layouts/dashboard/container';
import { Content } from '@/layouts/dashboard/content';
import { Header } from '@/layouts/dashboard/header';
import { Sidebar } from './sidebar';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface VaultDashboardLayoutProps {
  children?: React.ReactNode;
}

const VaultDashboardLayout = (props: VaultDashboardLayoutProps) => {
  const {
    screenSizes: { vaultRequiredSizeToColumnLayout },
  } = useWorkspaceContext();

  return (
    <Container>
      <Header />
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
