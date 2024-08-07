import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  HStack,
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { RiMenuUnfoldLine } from 'react-icons/ri';

import { CustomSkeleton, HomeIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Drawer } from '@/layouts/dashboard/drawer';
import { AssetsBalanceList, Pages, useScreenSize } from '@/modules/core';
import { useHome } from '@/modules/home';

import { useVaultInfosContext } from '../../VaultInfosProvider';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const VaultBalancePage = () => {
  const navigate = useNavigate();
  const menuDrawer = useDisclosure();
  const { vault, assets } = useVaultInfosContext();

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { goWorkspace },
    },
  } = useWorkspaceContext();
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

            {!userInfos.onSingleWorkspace && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() => goWorkspace(userInfos.workspace?.id)}
                  maxW={40}
                  isTruncated
                >
                  {userInfos.workspace?.name}
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
                      vaultId: vault?.data?.id!,
                      workspaceId: userInfos.workspace?.id ?? '',
                    }),
                  )
                }
                isTruncated
                maxW={640}
              >
                {vault.data?.name}
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
          isLoaded={!userInfos.isLoading && !assets.isLoading}
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
