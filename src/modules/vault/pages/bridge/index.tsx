import { Box, HStack } from 'bako-ui';

import { FormBridgeProvider } from '../../components/bridge/providers/FormBridgeProvider';
import { useVaultInfosContext } from '../../hooks';
import { useStepsBridge } from '../../hooks/bridge';
import { FormPageBrigde } from './form';

const VaultBridgePage = () => {
  const { vault, assets } = useVaultInfosContext();
  const { setScreenBridge } = useStepsBridge();

  if (!vault) return null;

  return (
    <Box w="full" p={0} flex={1}>
      <HStack gap={5} align="center" justifyContent="center" h="100%">
        <FormBridgeProvider>
          <FormPageBrigde setScreenBridge={setScreenBridge} assets={assets} />
          {/* {screenBridge === 'form' && isMobile && (
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
          )} */}
        </FormBridgeProvider>
      </HStack>
    </Box>
  );
};

export { VaultBridgePage };
