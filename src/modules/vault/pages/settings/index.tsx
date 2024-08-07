import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Icon,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { RiMenuUnfoldLine } from 'react-icons/ri';

import { HomeIcon } from '@/components';
import { Drawer } from '@/layouts/dashboard/drawer';
import { Pages, useScreenSize } from '@/modules/core';
import { useHome } from '@/modules/home/hooks/useHome';

import { SettingsOverview } from '../../components/SettingsOverview';
import { SettingsSigners } from '../../components/SettingsSigners';
import { useVaultInfosContext } from '../../VaultInfosProvider';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const VaultSettingsPage = () => {
  const navigate = useNavigate();
  const menuDrawer = useDisclosure();
  const { vault, assets, isPendingSigner } = useVaultInfosContext();

  const { goHome } = useHome();
  const {
    authDetails: { userInfos },
    workspaceInfos: { goWorkspace },
  } = useWorkspaceContext();
  const { vaultRequiredSizeToColumnLayout } = useScreenSize();

  const workspaceId = userInfos.workspace?.id ?? '';

  if (!vault) return null;

  return (
    <Box w="full">
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
                  {userInfos?.workspace?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
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
                      vaultId: vault.data?.id!,
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
          assets={assets}
          blockedTransfers={isPendingSigner}
        />
        <SettingsSigners vault={vault} />
      </VStack>
    </Box>
  );
};

export { VaultSettingsPage };
