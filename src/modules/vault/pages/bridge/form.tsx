import { Button, VStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { Asset } from '@/modules/core';

import {
  AmountBrigde,
  DetailsBridge,
  InputAddressBridge,
  SelectBridgeNetwork,
} from '../../components/bridge';
import { useFormBridge } from '../../hooks/bridge';

interface FormPageBrigdeProps {
  stepsForm: number;
  setStepsForm: React.Dispatch<React.SetStateAction<number>>;
  setScreenBridge: React.Dispatch<React.SetStateAction<'form' | 'resume'>>;
  assets?: Required<Asset>[];
}

const MotionBox = motion(VStack);

export function FormPageBrigde({
  stepsForm,
  setStepsForm,
  setScreenBridge,
  assets,
}: FormPageBrigdeProps) {
  const { assetFrom, isFormComplete, onSubmit } = useFormBridge();

  return (
    <VStack w={'full'} justifyContent="center" align="center">
      <form onSubmit={onSubmit}>
        <VStack alignItems="center" w="full" spacing={2}>
          <SelectBridgeNetwork
            stepsForm={stepsForm}
            setStepsForm={setStepsForm}
          />
          <AnimatePresence mode="wait">
            {stepsForm > 0 && (
              <AmountBrigde
                symbol={assetFrom?.symbol ?? ''}
                stepsForm={stepsForm}
                setStepsForm={setStepsForm}
                assets={assets}
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
                isDisabled={!isFormComplete}
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
    </VStack>
  );
}
