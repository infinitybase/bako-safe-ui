import { Button, Card, Heading, HStack, Text, Tooltip } from 'bako-ui';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { Asset } from '@/modules/core';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace';

import { useAmountBridge } from '../../hooks/bridge';
import { BRIDGE_STEPS_HEIGHTS } from '../../utils';
import { TooltipPendingTx } from '../TooltipPendingTx';
import { ExpandableCardSection } from './ExpandableCardSection';
import { InputAmount } from './inputAmount';
import { useFormBridgeContext } from './providers/FormBridgeProvider';
import { BridgeStepsForm } from './utils';

export interface AmountBridgeProps {
  symbol: string;
  assets?: Required<Asset>[];
  errorAmount?: string | null;
  setErrorAmount: React.Dispatch<React.SetStateAction<string | null>>;
  decimals?: number;
}

export function AmountBrigde({
  symbol,
  assets,
  errorAmount,
  setErrorAmount,
  decimals,
}: AmountBridgeProps) {
  const {
    screenSizes: { isExtraSmall },
  } = useWorkspaceContext();
  const { isPendingSigner } = useTransactionsContext();

  const { stepForm, setStepForm, isLoadingQuote } = useFormBridgeContext();
  const { watch } = useFormContext();
  const amount = watch('amount');

  const isCurrentStep = stepForm === BridgeStepsForm.AMOUNT;
  const isAfterAmountStep = stepForm > BridgeStepsForm.AMOUNT;

  const {
    balance,
    handleSourceChange,
    handleGetFeeBeforeMaxAmount,
    handleMinAmount,
  } = useAmountBridge({ assets, setErrorAmount });

  const handleContinue = () => {
    setStepForm(BridgeStepsForm.DESTINATION);
  };

  const amountGreaterThanZero = Number(amount) > 0;

  const ToolTipComponent = useMemo(() => {
    return isPendingSigner ? <TooltipPendingTx /> : null;
  }, [isPendingSigner]);

  return (
    <Card.Root
      variant="subtle"
      rounded="2xl"
      w="full"
      minH="88px"
      bg="bg.panel"
      position="relative"
      maxH={BRIDGE_STEPS_HEIGHTS.EXPANDED.AMOUNT}
      overflow="hidden"
      justifyContent="center"
    >
      <Card.Header
        pb={!isCurrentStep ? 6 : 0}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading
          color={!isCurrentStep ? 'textSecondary' : 'textPrimary'}
          fontSize="sm"
        >
          Amount
        </Heading>

        {isAfterAmountStep && (
          <Text color="gray.50" fontSize="sm">
            {amount}
            <Text as="span" ml="1" color="gray.400">
              {symbol}
            </Text>
          </Text>
        )}
        {!isAfterAmountStep && symbol && (
          <Text color="gray.400" fontSize="xs">
            {balance} {symbol}
          </Text>
        )}
      </Card.Header>

      <ExpandableCardSection isExpanded={isCurrentStep} type="body">
        <InputAmount
          symbol={symbol}
          decimals={decimals}
          value={amount}
          onChange={handleSourceChange}
          disabled={!isCurrentStep}
        />

        <Text color="red.500" fontSize="xs" minH="18px">
          {errorAmount && errorAmount}
        </Text>
      </ExpandableCardSection>

      <ExpandableCardSection
        isExpanded={isCurrentStep}
        type="footer"
        maxHeight="200px"
      >
        <HStack w="full" justifyContent="space-between" alignItems="flex-end">
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
            {isCurrentStep && amountGreaterThanZero && (
              <Tooltip
                content={ToolTipComponent}
                disabled={!ToolTipComponent}
                contentProps={{
                  bg: 'bg.muted',
                  borderColor: 'bg.panel',
                }}
                showArrow
                positioning={{ placement: 'top' }}
              >
                <Button
                  w={isExtraSmall ? 'auto' : '120px'}
                  alignSelf="flex-end"
                  onClick={handleContinue}
                  disabled={!!errorAmount || isPendingSigner}
                  loading={isLoadingQuote}
                >
                  Continue
                </Button>
              </Tooltip>
            )}
          </HStack>
        </HStack>
      </ExpandableCardSection>
    </Card.Root>
  );
}
