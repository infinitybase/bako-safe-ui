import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Icon,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import { HomeIcon } from '@ui/components';
import AddAssetsDialog from '@/components/addAssetsDialog';
import DepositDialog from '@/components/depositDialog';
import { Drawer } from '@/layouts/dashboard/drawer';
import { Pages } from '@/modules/core';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { SettingsOverview } from '../../components/SettingsOverview';
import { SettingsSigners } from '../../components/SettingsSigners';
import { useVaultInfosContext } from '../../VaultInfosProvider';

const VaultSettingsPage = () => {
  const [addAssetsDialogState, setAddAssetsDialogState] = useState(false);
  const [depositDialogState, setDepositDialogState] = useState(false);
  const navigate = useNavigate();
  const menuDrawer = useDisclosure();
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
      <Drawer isOpen={menuDrawer.isOpen} onClose={menuDrawer.onClose} />

      <DepositDialog
        isOpen={depositDialogState}
        setIsDepositDialogOpen={setDepositDialogState}
        vault={vault.data}
      />

      <AddAssetsDialog
        isOpen={addAssetsDialogState}
        setIsAddAssetDialogOpen={setAddAssetsDialogState}
        setIsDepositDialogOpen={setDepositDialogState}
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
                isTruncated
                maxW={640}
              >
                {vault?.data?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
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
          </Breadcrumb>
        )}
      </HStack>

      <VStack mb={14} alignItems="flex-start" w="100%" maxW="full" spacing={12}>
        <SettingsOverview
          vault={vault}
          assets={assets}
          blockedTransfers={isPendingSigner}
          setAddAssetsDialogState={setAddAssetsDialogState}
        />
        <SettingsSigners vault={vault} />
      </VStack>
    </Box>
  );
};

export { VaultSettingsPage };
