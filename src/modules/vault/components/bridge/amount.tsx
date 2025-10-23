import { Button, Card, Heading, HStack, Stack, Text, VStack } from 'bako-ui';
import { motion } from 'framer-motion';

import { Asset } from '@/modules/core';

import { useAmountBridge, useFormBridge } from '../../hooks/bridge';
import { ExpandableCardSection } from './ExpandableCardSection';
import { InputAmount } from './inputAmount';
import { useFormBridgeContext } from './providers/FormBridgeProvider';
import { BridgeStepsForm } from './utils';

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
  const { amount } = useFormBridge();
  const { stepForm, setStepForm } = useFormBridgeContext();

  const isCurrentStep = stepForm === BridgeStepsForm.AMOUNT;

  const {
    balance,
    handleSourceChange,
    handleGetFeeBeforeMaxAmount,
    handleMinAmount,
  } = useAmountBridge({ stepsForm, setStepsForm, assets, setErrorAmount });

  const handleContinue = () => {
    setStepForm(BridgeStepsForm.DESTINATION);
  };

  const amountGreaterThanZero = Number(amount) > 0;

  return (
    <MotionBox w={456}>
      <Card.Root
        variant="subtle"
        rounded="2xl"
        w="full"
        bg="bg.panel"
        position="relative"
        overflow="hidden"
      >
        <Card.Header pb={!isCurrentStep ? 6 : 0}>
          <Heading color="textPrimary" fontSize="sm">
            Amount
          </Heading>
        </Card.Header>

        <ExpandableCardSection isExpanded={isCurrentStep} type="body">
          <InputAmount
            symbol={symbol}
            value={amount}
            onChange={handleSourceChange}
            disabled={!isCurrentStep}
          />
        </ExpandableCardSection>

        <ExpandableCardSection
          isExpanded={isCurrentStep}
          type="footer"
          maxHeight="200px"
        >
          <HStack w="full" justifyContent="space-between">
            <HStack gap={2}>
              <Button
                variant="subtle"
                borderRadius="lg"
                px={3}
                onClick={handleMinAmount}
                disabled={!isCurrentStep}
              >
                MIN
              </Button>
              <Button
                variant="subtle"
                onClick={handleGetFeeBeforeMaxAmount}
                borderRadius="lg"
                px={3}
                disabled={!isCurrentStep}
              >
                MAX
              </Button>
            </HStack>
            <HStack flex={1} justifyContent="flex-end">
              <Stack>
                {!!errorAmount && (
                  <Text color="red.500" fontSize="xs">
                    {errorAmount}
                  </Text>
                )}
                <Text color="gray.400" fontSize="sm">
                  {symbol && balance + ' ' + symbol}
                </Text>
                {isCurrentStep && amountGreaterThanZero && (
                  <Button
                    w="full"
                    onClick={handleContinue}
                    disabled={!!errorAmount}
                  >
                    Continue
                  </Button>
                )}
              </Stack>
            </HStack>
          </HStack>
        </ExpandableCardSection>
      </Card.Root>
    </MotionBox>
  );
}
