import { VStack } from 'bako-ui';
import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';

import {
  AmountBrigde,
  DetailsBridge,
  InputAddressBridge,
} from '../../components/bridge';
import { FromFormStep } from '../../components/bridge/form/FromStep';
import { ToFormStep } from '../../components/bridge/form/ToStep';
import { useFormBridgeContext } from '../../components/bridge/providers/FormBridgeProvider';
import { BridgeStepsForm } from '../../components/bridge/utils';
import { UseVaultDetailsReturn } from '../../hooks';
import { useFormBridge } from '../../hooks/bridge';
import { getYPositionForStep } from '../../utils';

interface FormPageBrigdeProps {
  setScreenBridge: React.Dispatch<React.SetStateAction<'form' | 'resume'>>;
  assets?: UseVaultDetailsReturn['assets'];
}

const MotionBox = motion(VStack);

export function FormPageBrigde({ assets }: FormPageBrigdeProps) {
  const [errorAmount, setErrorAmount] = useState<string | null>(null);

  const { assetFrom, onSubmit } = useFormBridge();
  const { stepForm, setStepForm } = useFormBridgeContext();

  const showResume = stepForm >= BridgeStepsForm.TO;

  const getOpacityForStep = useCallback(
    (step: BridgeStepsForm) => {
      const distance = Math.abs(stepForm - step);
      if (distance === 0) return 1; // Current step
      if (distance === 1) return 0.5; // 1 step away
      if (distance === 2) return 0.3; // 2 steps away
      return 0.2; // 3+ steps away
    },
    [stepForm],
  );

  const commonTransition = useMemo(
    () => ({
      duration: 0.6,
      ease: [0.32, 0.72, 0, 1],
    }),
    [],
  );

  const handleChangeStep = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, step: BridgeStepsForm) => {
      // Only allow going back to previous steps
      if (stepForm !== step && step < stepForm) {
        e.stopPropagation();
        setStepForm(step);
      }
    },
    [stepForm, setStepForm],
  );

  return (
    <VStack
      as="form"
      onSubmit={onSubmit}
      w="full"
      h="600px"
      px={{ base: 2, sm: 0 }}
      justifyContent="center"
      align="center"
      overflow="hidden"
      position="relative"
      pt="0"
    >
      <VStack
        w={{ sm: '456px', base: 'full' }}
        h="full"
        position="relative"
        justifyContent="center"
      >
        {/* FROM STEP 0 */}
        <MotionBox
          onClick={(e) => handleChangeStep(e, BridgeStepsForm.FROM)}
          position="absolute"
          w="full"
          animate={{
            opacity: getOpacityForStep(BridgeStepsForm.FROM),
            y: getYPositionForStep(BridgeStepsForm.FROM, stepForm),
          }}
          transition={commonTransition}
          style={{
            zIndex: stepForm === BridgeStepsForm.FROM ? 5 : 1,
          }}
        >
          <FromFormStep setErrorAmount={setErrorAmount} />
        </MotionBox>

        {/* TO STEP 1 */}
        <MotionBox
          onClick={(e) => handleChangeStep(e, BridgeStepsForm.TO)}
          position="absolute"
          w="full"
          animate={{
            opacity: getOpacityForStep(BridgeStepsForm.TO),
            y: getYPositionForStep(BridgeStepsForm.TO, stepForm),
          }}
          transition={commonTransition}
          style={{
            zIndex: stepForm === BridgeStepsForm.TO ? 5 : 1,
          }}
        >
          <ToFormStep setErrorAmount={setErrorAmount} assets={assets?.assets} />
        </MotionBox>

        {/* AMOUNT STEP 2 */}
        <MotionBox
          onClick={(e) => handleChangeStep(e, BridgeStepsForm.AMOUNT)}
          position="absolute"
          w="full"
          animate={{
            opacity: getOpacityForStep(BridgeStepsForm.AMOUNT),
            y: getYPositionForStep(BridgeStepsForm.AMOUNT, stepForm),
          }}
          transition={commonTransition}
          style={{
            zIndex: stepForm === BridgeStepsForm.AMOUNT ? 5 : 1,
          }}
        >
          <AmountBrigde
            symbol={assetFrom?.symbol ?? ''}
            assets={assets?.assets}
            errorAmount={errorAmount}
            setErrorAmount={setErrorAmount}
          />
        </MotionBox>

        {/* DESTINATION STEP 3 */}
        <MotionBox
          onClick={(e) => handleChangeStep(e, BridgeStepsForm.DESTINATION)}
          position="absolute"
          w="full"
          animate={{
            opacity: getOpacityForStep(BridgeStepsForm.DESTINATION),
            y: getYPositionForStep(BridgeStepsForm.DESTINATION, stepForm),
          }}
          transition={commonTransition}
          style={{
            zIndex: stepForm === BridgeStepsForm.DESTINATION ? 5 : 1,
          }}
        >
          <InputAddressBridge />
        </MotionBox>

        {/* RESUME STEP 4 */}
        {showResume && (
          <MotionBox
            onClick={(e) => handleChangeStep(e, BridgeStepsForm.RESUME)}
            position="absolute"
            w="full"
            animate={{
              opacity: getOpacityForStep(BridgeStepsForm.RESUME),
              y: getYPositionForStep(BridgeStepsForm.RESUME, stepForm),
            }}
            transition={commonTransition}
            style={{
              zIndex: stepForm === BridgeStepsForm.RESUME ? 5 : 1,
            }}
          >
            <DetailsBridge assets={assets} />
          </MotionBox>
        )}
      </VStack>
    </VStack>
  );
}
