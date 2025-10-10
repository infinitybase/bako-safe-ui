import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import { HomeIcon } from '@/components';
import { Drawer } from '@/layouts/dashboard/drawer';
import { Pages, useScreenSize } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { FormBridgeProvider } from '../../components/bridge/providers/FormBridgeProvider';
import { useStepsBridge } from '../../hooks/bridge';
import { useVaultInfosContext } from '../../VaultInfosProvider';
import { FormPageBrigde } from './form';
import { FormMobilePageBrigde } from './formMobile';
import { ResumePageBrigde } from './resumePage';

const VaultBridgePage = () => {
  const navigate = useNavigate();
  const menuDrawer = useDisclosure();
  const { vault, assets } = useVaultInfosContext();
  const { stepsForm, screenBridge, setScreenBridge, setStepsForm } =
    useStepsBridge();
  const { isMobile } = useScreenSize();

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { goHome },
    },
    screenSizes: { vaultRequiredSizeToColumnLayout },
  } = useWorkspaceContext();

  const workspaceId = userInfos.workspace?.id ?? '';

  if (!vault) return null;

  return (
    <Box w="full" p={0}>
      <Drawer isOpen={menuDrawer.isOpen} onClose={menuDrawer.onClose} />

      <HStack mb={{ base: 2, md: 8 }} w="full" justifyContent="space-between">
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
                Bridge
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )}
      </HStack>

      <HStack gap={5} align="flex-start" justifyContent="center" h="100%">
        <FormBridgeProvider>
          {screenBridge === 'form' && !isMobile && (
            <FormPageBrigde
              setStepsForm={setStepsForm}
              setScreenBridge={setScreenBridge}
              stepsForm={stepsForm}
              assets={assets}
            />
          )}
          {screenBridge === 'form' && isMobile && (
            <FormMobilePageBrigde
              assets={assets}
              setScreenBridge={setScreenBridge}
              stepsForm={stepsForm}
              setStepsForm={setStepsForm}
            />
          )}
          {screenBridge === 'resume' && (
            <ResumePageBrigde
              setScreenBridge={setScreenBridge}
              assets={assets.assets}
            />
          )}
        </FormBridgeProvider>
      </HStack>
    </Box>
  );
};

export { VaultBridgePage };
