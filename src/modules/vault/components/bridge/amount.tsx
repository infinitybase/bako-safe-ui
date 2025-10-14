import { Button, Card, HStack, Text, VStack } from 'bako-ui';
import { motion } from 'framer-motion';

import { Asset } from '@/modules/core';

import { useAmountBridge, useFormBridge } from '../../hooks/bridge';
import { InputAmount } from './inputAmount';

export interface AmountBridgeProps {
  symbol: string;
  stepsForm: number;
  setStepsForm: React.Dispatch<React.SetStateAction<number>>;
  assets?: Required<Asset>[];
  errorAmount?: string | null;
  setErrorAmount: React.Dispatch<React.SetStateAction<string | null>>;
}

const MotionBox = motion(VStack);

export function AmountBrigde({
  symbol,
  stepsForm,
  setStepsForm,
  assets,
  errorAmount,
  setErrorAmount,
}: AmountBridgeProps) {
  const { amount, assetFromUSD } = useFormBridge();

  const { balance, handleSourceChange, handleMaxAmount, handleMinAmount } =
    useAmountBridge({ stepsForm, setStepsForm, assets, setErrorAmount });

  return (
    <MotionBox
      w={430}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card.Root
        variant="outline"
        padding={3}
        paddingBottom={1}
        w={'full'}
        overflow="visible"
        position="relative"
      >
        <HStack>
          <Text color="grey.425" fontSize={12} fontWeight={400}>
            Amount
          </Text>
          <HStack flex={1} justifyContent="flex-end">
            <Text color="grey.425" fontSize={12} fontWeight={400}>
              Balance: {balance + ' ' + symbol}
            </Text>
          </HStack>
        </HStack>

        <InputAmount
          symbol={symbol}
          value={amount}
          onChange={handleSourceChange}
          disabled={false}
        />

        <HStack justifyContent="center" mb={{ base: 2, md: 4 }}>
          <Text color="grey.425" fontSize={12} fontWeight={400}>
            {assetFromUSD}
          </Text>
        </HStack>
        <HStack justifyContent="center" gap={2}>
          <Button
            maxH="28px"
            minW="48px"
            disabled={false}
            colorPalette="secondary"
            borderRadius={6}
            padding={'4px 6px 4px 6px'}
            fontSize={10}
            fontWeight={500}
            onClick={() => handleMinAmount()}
          >
            <Text color="grey.425">MIN</Text>
          </Button>
          <Button
            maxH="28px"
            minW="48px"
            disabled={false}
            colorPalette="secondary"
            onClick={() => handleMaxAmount()}
            borderRadius={6}
            padding={'4px 6px 4px 6px'}
            fontSize={10}
            fontWeight={500}
          >
            <Text color="grey.425">MAX</Text>
          </Button>
        </HStack>
        <HStack
          h={{
            base: 8,
            sm: 6,
          }}
          pt={1}
        >
          {!!errorAmount && (
            <Text color="red.500" fontSize="xs">
              {errorAmount}
            </Text>
          )}
        </HStack>
      </Card.Root>
    </MotionBox>
  );
}
