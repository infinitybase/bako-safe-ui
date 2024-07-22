import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { RiMenuUnfoldLine } from 'react-icons/ri';

import { CustomSkeleton, HomeIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Drawer } from '@/layouts/dashboard/drawer';
import { useAuth } from '@/modules/auth';
import { AssetsBalanceList, Pages, useScreenSize } from '@/modules/core';
import { useHome } from '@/modules/home';
import { useGetCurrentWorkspace, useWorkspace } from '@/modules/workspace';

import { useVaultInfosContext } from '../../providers/VaultInfosProvider';
import { useNavigate } from 'react-router-dom';

const VaultBalancePage = () => {
  const navigate = useNavigate();
  const { vault, menuDrawer, assets } = useVaultInfosContext();

  const { currentWorkspace, goWorkspace } = useWorkspace();
  const { workspace } = useGetCurrentWorkspace();
  const {
    workspaces: { current },
    isSingleWorkspace,
  } = useAuth();
  const { goHome } = useHome();
  const { vaultRequiredSizeToColumnLayout } = useScreenSize();

  if (!vault) return null;

  return (
    <Flex w="full" direction="column">
      <Drawer isOpen={menuDrawer.isOpen} onClose={menuDrawer.onClose} />

      <HStack mb={8} w="full" justifyContent="space-between">
        {vaultRequiredSizeToColumnLayout ? (
          <HStack gap={1.5} onClick={menuDrawer.onOpen}>
            <Icon as={RiMenuUnfoldLine} fontSize="xl" color="grey.200" />
            <Text fontSize="sm" fontWeight="normal" color="grey.100">
              Menu
            </Text>
          </HStack>
        ) : (
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => goHome()}
              >
                <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            {!isSingleWorkspace && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() => goWorkspace(current)}
                  maxW={40}
                  isTruncated
                >
                  {workspace?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                href="#"
              >
                Vaults
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() =>
                  navigate(
                    Pages.detailsVault({
                      vaultId: vault?.predicate?.id!,
                      workspaceId: current ?? '',
                    }),
                  )
                }
                isTruncated
                maxW={640}
              >
                {vault.predicate?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                href="#"
              >
                Balance
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )}
      </HStack>

      <Flex w="full" direction="column" flex={1}>
        <Box mb={5} w="full">
          <Text color="grey.200" fontWeight="semibold" fontSize="20px">
            Balance
          </Text>
        </Box>

        <CustomSkeleton
          isLoaded={!currentWorkspace.isLoading && !assets.isFirstAssetsLoading}
          flex={1}
        >
          {assets.hasAssets ? (
            <AssetsBalanceList assets={assets.assets!} />
          ) : (
            <EmptyState
              showAction={false}
              title="No Data available"
              subTitle="Currently, there is no available data to display in this section."
              h="full"
            />
          )}
        </CustomSkeleton>
      </Flex>
    </Flex>
  );
};

export { VaultBalancePage };
