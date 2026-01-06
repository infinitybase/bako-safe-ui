import {
  Button,
  Card,
  Field,
  Heading,
  Input,
  InputGroup,
  Text,
  Tooltip,
} from 'bako-ui';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { LineCloseIcon } from '@/components';
import { AddressUtils } from '@/modules/core';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';

import { BRIDGE_STEPS_HEIGHTS } from '../../utils';
import { TooltipPendingTx } from '../TooltipPendingTx';
import { ExpandableCardSection } from './ExpandableCardSection';
import {
  ITransferBridgePayload,
  useFormBridgeContext,
} from './providers/FormBridgeProvider';
import { BridgeStepsForm } from './utils';

export function InputAddressBridge() {
  const { control, watch } = useFormContext<ITransferBridgePayload>();
  const { stepForm, setStepForm } = useFormBridgeContext();
  const { isPendingSigner } = useTransactionsContext();

  const isCurrentStep = stepForm === BridgeStepsForm.DESTINATION;
  const isAfterDestinationStep = stepForm > BridgeStepsForm.DESTINATION;

  const handleContinue = () => {
    setStepForm(BridgeStepsForm.RESUME);
  };

  const currentDestinationAddress = watch('destinationAddress');

  const formatted = AddressUtils.isValid(currentDestinationAddress)
    ? AddressUtils.format(currentDestinationAddress)
    : currentDestinationAddress;

  const ToolTipComponent = useMemo(() => {
    return isPendingSigner ? <TooltipPendingTx /> : null;
  }, [isPendingSigner]);

  return (
    <Card.Root
      variant="subtle"
      rounded="2xl"
      w="full"
      minH="88px"
      maxH={BRIDGE_STEPS_HEIGHTS.EXPANDED.DESTINATION}
      bg="bg.panel"
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
          color={isCurrentStep ? 'textPrimary' : 'textSecondary'}
          fontSize="sm"
        >
          Destination
        </Heading>

        {isAfterDestinationStep && (
          <Text color="textSecondary" fontSize="sm">
            {formatted}
          </Text>
        )}
      </Card.Header>

      <ExpandableCardSection isExpanded={isCurrentStep} type="body">
        <Controller
          control={control}
          name="destinationAddress"
          render={({ field, fieldState }) => {
            return (
              <Field.Root invalid={fieldState.invalid} paddingY={6}>
                <InputGroup
                  endElement={
                    <LineCloseIcon
                      color="textPrimary"
                      display={field.value ? 'block' : 'none'}
                      fontSize="16px"
                      onClick={() => field.onChange('')}
                    />
                  }
                >
                  <Input
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Enter address"
                    variant="subtle"
                    w="100%"
                    disabled={!isCurrentStep}
                  />
                </InputGroup>
                <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
              </Field.Root>
            );
          }}
        />
      </ExpandableCardSection>

      <ExpandableCardSection
        isExpanded={isCurrentStep}
        type="footer"
        maxHeight="100px"
      >
        {isCurrentStep && (
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
              alignSelf="self-end"
              w="120px"
              onClick={handleContinue}
              disabled={!currentDestinationAddress || isPendingSigner}
            >
              Continue
            </Button>
          </Tooltip>
        )}
      </ExpandableCardSection>
    </Card.Root>
  );
}
