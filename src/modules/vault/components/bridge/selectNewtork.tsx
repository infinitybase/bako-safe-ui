import { Box, VStack } from 'bako-ui';
import { motion } from 'framer-motion';

import { useFormBridge } from '../../hooks/bridge';
import { FromFormStep } from './form/FromStep';
import { ToFormStep } from './form/ToStep';

export interface SelectNetworkProps {
  stepsForm: number;
  setStepsForm: React.Dispatch<React.SetStateAction<number>>;
  setErrorAmount: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface NetworkOptionItem {
  value: string;
  image: string;
  name: string;
  symbol: string;
}

const MotionBox = motion(Box);

export function SelectBridgeNetwork({
  stepsForm,
  setStepsForm,
  setErrorAmount,
}: SelectNetworkProps) {
  const { assetFrom, assetTo, networkTo } = useFormBridge();

  const isFinishedSelectFrom = Boolean(assetFrom?.value);
  const isFinishedSelectTo = Boolean(assetTo?.value && networkTo?.value);

  return (
    <MotionBox
      w={stepsForm === 0 ? '456px' : '430px'}
      animate={{
        y: isFinishedSelectFrom ? -80 : 0,
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <VStack w="full">
        <MotionBox
          animate={{
            opacity: isFinishedSelectFrom ? 0.7 : 1,
            scale: isFinishedSelectFrom ? 0.95 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          w="full"
          // mb={isFinishedSelectFrom ? 4 : 0}
        >
          <FromFormStep
            setStepsForm={setStepsForm}
            stepsForm={stepsForm}
            setErrorAmount={setErrorAmount}
          />
        </MotionBox>

        <MotionBox
          animate={{
            opacity: isFinishedSelectTo ? 0.7 : 1,
            scale: isFinishedSelectTo ? 0.95 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          w="full"
          // mb={isFinishedSelectTo ? 4 : 0}
        >
          <ToFormStep />
        </MotionBox>
      </VStack>
    </MotionBox>
  );
}
