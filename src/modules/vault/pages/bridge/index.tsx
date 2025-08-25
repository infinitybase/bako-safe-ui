import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  HStack,
  Icon,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FormProvider } from 'react-hook-form';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import { HomeIcon } from '@/components';
import { Drawer } from '@/layouts/dashboard/drawer';
import { Pages, useScreenSize } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import {
  AmountBrigde,
  DetailsBridge,
  InputAddressBridge,
  SelectBridgeNetwork,
} from '../../components/bridge';
import { useFormBridge, useStepsBridge } from '../../hooks/bridge';
import { useVaultInfosContext } from '../../VaultInfosProvider';
import { FormMobilePageBrigde } from './formMobile';
import { ResumePageBrigde } from './resumePage';

const MotionBox = motion(VStack);

const VaultBridgePage = () => {
  const navigate = useNavigate();
  const menuDrawer = useDisclosure();
  const { vault } = useVaultInfosContext();
  const { stepsForm, screenBridge, setScreenBridge, setStepsForm } =
    useStepsBridge();

  const { form, onSubmit } = useFormBridge();

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
        {screenBridge === 'form' && !isMobile && (
          <VStack w={'full'} justifyContent="center" align="center">
            <FormProvider {...form}>
              <form onSubmit={onSubmit}>
                <VStack alignItems="center" w="full" spacing={2}>
                  <SelectBridgeNetwork
                    stepsForm={stepsForm}
                    setStepsForm={setStepsForm}
                  />
                  <AnimatePresence mode="wait">
                    {stepsForm > 0 && (
                      <AmountBrigde
                        stepsForm={stepsForm}
                        setStepsForm={setStepsForm}
                      />
                    )}
                  </AnimatePresence>
                  {stepsForm > 1 && (
                    <MotionBox
                      key="box"
                      initial={{ y: -40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -40, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      w="full"
                    >
                      <DetailsBridge />
                      <InputAddressBridge />
                      <Button
                        //isDisabled={!hasPermission([OWNER, MANAGER, ADMIN])}
                        variant="primary"
                        type="submit"
                        fontWeight={600}
                        fontSize={14}
                        letterSpacing={'2%'}
                        w={'full'}
                        mt={4}
                        onClick={() => setScreenBridge('resume')}
                      >
                        Continue to resume
                      </Button>
                    </MotionBox>
                  )}
                </VStack>
              </form>
            </FormProvider>
          </VStack>
        )}
        {screenBridge === 'form' && isMobile && (
          <FormProvider {...form}>
            <FormMobilePageBrigde setScreenBridge={setScreenBridge} />
          </FormProvider>
        )}
        {screenBridge === 'resume' && (
          <ResumePageBrigde setScreenBridge={setScreenBridge} />
        )}
      </HStack>
    </Box>
  );
};

export { VaultBridgePage };
