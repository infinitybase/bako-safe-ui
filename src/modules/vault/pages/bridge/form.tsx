import { Button, VStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import {
  AmountBrigde,
  DetailsBridge,
  InputAddressBridge,
  SelectBridgeNetwork,
} from '../../components/bridge';
import { TitleButtonsForm } from '../../components/bridge/utils';
import { UseVaultDetailsReturn } from '../../hooks';
import { useFormBridge } from '../../hooks/bridge';

interface FormPageBrigdeProps {
  stepsForm: number;
  setStepsForm: React.Dispatch<React.SetStateAction<number>>;
  setScreenBridge: React.Dispatch<React.SetStateAction<'form' | 'resume'>>;
  assets?: UseVaultDetailsReturn['assets'];
}

const MotionBox = motion(VStack);

export function FormPageBrigde({
  stepsForm,
  setStepsForm,
  setScreenBridge,
  assets,
}: FormPageBrigdeProps) {
  const [errorAmount, setErrorAmount] = useState<string | null>(null);

  const { assetFrom, isFormComplete, errorForm, isPendingSigner } =
    useFormBridge();

  const notEnoughBalanceETH = useMemo(() => {
    return assets?.isEthBalanceLowerThanReservedAmount;
  }, [assets]);

  return (
    <VStack w={'full'} justifyContent="center" align="center">
      <VStack alignItems="center" w="full" spacing={2}>
        <SelectBridgeNetwork
          stepsForm={stepsForm}
          setStepsForm={setStepsForm}
          setErrorAmount={setErrorAmount}
        />
        <AnimatePresence mode="wait">
          {stepsForm > 0 && (
            <AmountBrigde
              symbol={assetFrom?.symbol ?? ''}
              stepsForm={stepsForm}
              setStepsForm={setStepsForm}
              assets={assets?.assets}
              errorAmount={errorAmount}
              setErrorAmount={setErrorAmount}
              decimals={assetFrom?.decimals}
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
            w={430}
          >
            <DetailsBridge />
            <InputAddressBridge />
            <Button
              isDisabled={
                !isFormComplete ||
                !!errorForm ||
                isPendingSigner ||
                notEnoughBalanceETH
              }
              variant="primary"
              fontWeight={600}
              fontSize={16}
              letterSpacing={'2%'}
              w={'full'}
              mt={4}
              onClick={() => setScreenBridge('resume')}
            >
              {isPendingSigner
                ? TitleButtonsForm.PENDING_TX
                : notEnoughBalanceETH
                  ? TitleButtonsForm.INSUFFICIENT_ETH
                  : TitleButtonsForm.CONTINUE}
            </Button>
          </MotionBox>
        )}
      </VStack>
    </VStack>
  );
}
