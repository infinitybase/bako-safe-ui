import { Box, Breadcrumb, Container, HStack, Icon, Text } from 'bako-ui';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import { HomeIcon } from '@/components';
import { Drawer } from '@/layouts/dashboard/drawer';
import { Pages, useBakoSafeVault } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { RootSwap } from '../../components/swap/Root';
import { useAssetsList, useVaultInfosContext } from '../../hooks';

export const VaultSwapPage = () => {
  const navigate = useNavigate();
  const menuDrawer = useDisclosure();
  const { vault } = useVaultInfosContext();
  const { data: bakoVault, isLoading: isLoadingVault } = useBakoSafeVault({
    id: vault?.data?.id,
    address: vault?.data?.predicateAddress,
  });
  const { assets, isLoading: isLoadingAssets } = useAssetsList({
    vault: bakoVault,
  });

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { goHome },
    },
    screenSizes: { vaultRequiredSizeToColumnLayout },
  } = useWorkspaceContext();

  const workspaceId = userInfos.workspace?.id ?? '';

  const isLoading = isLoadingAssets || isLoadingVault || vault.isLoading;

  return (
    <Box w="full">
      <Drawer open={menuDrawer.isOpen} onOpenChange={menuDrawer.onOpenChange} />

      <HStack mb={8} w="full" justifyContent="space-between">
        {vaultRequiredSizeToColumnLayout ? (
          <HStack gap={1.5} onClick={menuDrawer.onOpen}>
            <Icon as={RiMenuUnfoldLine} fontSize="xl" color="grey.200" />
            <Text fontSize="sm" fontWeight="normal" color="grey.100">
              Menu
            </Text>
          </HStack>
        ) : (
          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() => goHome()}
                >
                  <Icon mr={2} as={HomeIcon} w={3} color="grey.200" />
                  Home
                </Breadcrumb.Link>
              </Breadcrumb.Item>

              <Breadcrumb.Separator />

              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  href="#"
                  onClick={() =>
                    navigate(
                      Pages.userVaults({
                        workspaceId,
                      }),
                    )
                  }
                >
                  Vaults
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() =>
                    navigate(
                      Pages.detailsVault({
                        vaultId: vault.data?.id,
                        workspaceId: userInfos.workspace?.id ?? '',
                      }),
                    )
                  }
                  truncate
                  maxW={640}
                >
                  {vault?.data?.name}
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  href="#"
                >
                  Swap
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        )}
      </HStack>

      <Container>
        <RootSwap
          vault={bakoVault}
          assets={assets}
          networkUrl={userInfos?.network?.url}
          isLoadingAssets={isLoading}
        />
      </Container>
    </Box>
  );
};
