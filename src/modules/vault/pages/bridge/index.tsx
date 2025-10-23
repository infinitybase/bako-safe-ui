import { Box, HStack } from 'bako-ui';

import { useScreenSize } from '@/modules/core';

import { FormBridgeProvider } from '../../components/bridge/providers/FormBridgeProvider';
import { useVaultInfosContext } from '../../hooks';
import { useStepsBridge } from '../../hooks/bridge';
import { FormPageBrigde } from './form';
import { FormMobilePageBrigde } from './formMobile';
import { ResumePageBrigde } from './resumePage';

const VaultBridgePage = () => {
  const { vault, assets } = useVaultInfosContext();
  const { stepsForm, screenBridge, setScreenBridge, setStepsForm } =
    useStepsBridge();
  const { isMobile } = useScreenSize();

  if (!vault) return null;

  return (
    <Box w="full" p={0} flex={1}>
      <HStack gap={5} align="center" justifyContent="center" h="100%">
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
