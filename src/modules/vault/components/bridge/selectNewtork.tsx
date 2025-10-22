import { Box, VStack } from 'bako-ui';
import { motion } from 'framer-motion';

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
  return (
    <VStack
      w={stepsForm === 0 ? '456px' : '430px'}
      transition="width 0.3s ease"
    >
      <FromFormStep setStepsForm={setStepsForm} stepsForm={stepsForm} />

      <ToFormStep setStepsForm={setStepsForm} stepsForm={stepsForm} />
    </VStack>
  );
}
