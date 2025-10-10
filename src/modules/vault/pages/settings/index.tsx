import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import { HomeIcon } from '@/components';
import AddAssetsDialog from '@/components/addAssetsDialog';
import DepositDialog from '@/components/depositDialog';
import { Drawer } from '@/layouts/dashboard/drawer';
import { Pages } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { SettingsOverview } from '../../components/SettingsOverview';
import { SettingsSigners } from '../../components/SettingsSigners';
import { useVaultInfosContext } from '../../VaultInfosProvider';

const VaultSettingsPage = () => {
  const navigate = useNavigate();
  const menuDrawer = useDisclosure();
  const depositDialog = useDisclosure();
  const addAssetsDialog = useDisclosure();
  const { vault, assets } = useVaultInfosContext();
  const { isPendingSigner } = useTransactionsContext();

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: {
        // handleWorkspaceSelection,
        goHome,
      },
    },
    screenSizes: { vaultRequiredSizeToColumnLayout },
  } = useWorkspaceContext();

  const workspaceId = userInfos.workspace?.id ?? '';

  if (!vault) return null;

  return (
    <Box w="full">
      <Drawer open={menuDrawer.isOpen} onOpenChange={menuDrawer.onOpenChange} />

      <DepositDialog
        isOpen={depositDialog.isOpen}
        onOpenChange={depositDialog.onOpenChange}
        vault={vault.data}
      />

      <AddAssetsDialog
        isOpen={addAssetsDialog.isOpen}
        onOpenChange={addAssetsDialog.onOpenChange}
        setIsDepositDialogOpen={depositDialog.setOpen}
      />

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
              <BreadcrumbItem>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() => goHome()}
                >
                  <Icon mr={2} as={HomeIcon} w={3} color="grey.200" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>

              <Breadcrumb.Separator />

              {/* Commented out code to temporarily disable workspaces. */}

              {/* {!userInfos.onSingleWorkspace && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() =>
                    handleWorkspaceSelection(
                      userInfos.workspace?.id,
                      Pages.workspace({
                        workspaceId: userInfos.workspace?.id,
                      }),
                    )
                  }
                  maxW={40}
                  isTruncated
                >
                  {userInfos?.workspace?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )} */}
              <BreadcrumbItem>
                <BreadcrumbLink
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
                </BreadcrumbLink>
              </BreadcrumbItem>
              <Breadcrumb.Separator />

              <BreadcrumbItem>
                <BreadcrumbLink
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
                </BreadcrumbLink>
              </BreadcrumbItem>
              <Breadcrumb.Separator />

              <BreadcrumbItem>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  href="#"
                >
                  Settings
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        )}
      </HStack>

      <VStack mb={14} alignItems="flex-start" w="100%" maxW="full" gap={12}>
        <SettingsOverview
          vault={vault}
          assets={assets}
          blockedTransfers={isPendingSigner}
          setAddAssetsDialogState={addAssetsDialog.setOpen}
        />
        <SettingsSigners vault={vault} />
      </VStack>
    </Box>
  );
};

export { VaultSettingsPage };
