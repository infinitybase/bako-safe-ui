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

import { HomeIcon } from '@/components';
import { Drawer } from '@/layouts/dashboard/drawer';
import { useAuth } from '@/modules/auth';
import { Pages, useScreenSize } from '@/modules/core';
import { useHome } from '@/modules/home/hooks/useHome';
import { useVaultDetails } from '@/modules/vault/hooks';

import { SettingsOverview } from '../../components/SettingsOverview';
import { SettingsSigners } from '../../components/SettingsSigners';

const VaultSettingsPage = () => {
  const { vault, store, navigate, menuDrawer } = useVaultDetails();

  const { goHome } = useHome();
  const {
    workspaces: { current },
  } = useAuth();
  const { vaultRequiredSizeToColumnLayout } = useScreenSize();

  if (!vault) return null;

  return (
    <Box w="full" pr={[0, 8]}>
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
              <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => goHome()}
              >
                Home
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
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() =>
                  navigate(
                    Pages.detailsVault({
                      vaultId: vault.id!,
                      workspaceId: current ?? '',
                    }),
                  )
                }
                isTruncated
                maxW={640}
              >
                {vault.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )}

        {/* <Button
          variant="secondary"
          bgColor="dark.100"
          border="none"
          onClick={() => {
            setTemplateFormInitial({
              minSigners: vault.minSigners!,
              addresses:
                vault.signers! && vault.signers.map((signer) => signer.address),
            });
            navigate(
              Pages.createTemplate({
                vaultId: params.vaultId!,
                workspaceId: params.workspaceId!,
              }),
            );
          }}
        >
          Set as template
        </Button> */}
      </HStack>

      <VStack mb={14} alignItems="flex-start" w="100%" maxW="full" spacing={12}>
        <SettingsOverview
          vault={vault}
          store={store}
          blockedTransfers={vault.transactions.isPendingSigner}
        />
        <SettingsSigners vault={vault} />
      </VStack>
    </Box>
  );
};

export { VaultSettingsPage };
