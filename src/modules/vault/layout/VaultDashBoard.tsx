import { Flex } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { useScreenSize } from '@/modules/core/hooks';

import { Container } from '@/layouts/dashboard/container';
import { Content } from '@/layouts/dashboard/content';
import { Header } from '@/layouts/dashboard/header';
import { Sidebar } from './sidebar';
import { useVaultInfosContext } from '@/modules/vault/providers/VaultInfosProvider';

interface VaultDashboardLayoutProps {
  children?: React.ReactNode;
  isFirstAssetsLoading: boolean;
  isPendingSigner: boolean;
  hasBalance?: boolean;
}

const VaultDashboardLayout = (props: VaultDashboardLayoutProps) => {
  const { vaultRequiredSizeToColumnLayout } = useScreenSize();

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
  const {
    isPendingSigner,
    assets: { isFirstAssetsLoading, hasBalance },
  } = useVaultInfosContext();

  return (
    <VaultDashboardLayout
      isFirstAssetsLoading={isFirstAssetsLoading}
      isPendingSigner={isPendingSigner}
      hasBalance={hasBalance}
    >
      <Outlet />
    </VaultDashboardLayout>
  );
};

export { VaultDashboardLayout, VaultDashboardLayoutRouter };
