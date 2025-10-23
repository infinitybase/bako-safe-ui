import { Button, Card, Field, Heading, Input, InputGroup } from 'bako-ui';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { LineCloseIcon } from '@/components';
import { AddressUtils } from '@/modules/core';

import { ExpandableCardSection } from './ExpandableCardSection';
import {
  ITransferBridgePayload,
  useFormBridgeContext,
} from './providers/FormBridgeProvider';
import { BridgeStepsForm } from './utils';

export function InputAddressBridge() {
  const { control } = useFormContext<ITransferBridgePayload>();
  const { stepForm, setStepForm } = useFormBridgeContext();
  const [isFocused, setIsFocused] = useState(false);

  const isCurrentStep = stepForm === BridgeStepsForm.DESTINATION;

  const handleContinue = () => {
    setStepForm(BridgeStepsForm.RESUME);
  };

  return (
    <Card.Root
      variant="subtle"
      rounded="2xl"
      w="458px"
      bg="bg.panel"
      overflow="hidden"
    >
      <Card.Header pb={!isCurrentStep ? 6 : 0}>
        <Heading color="textPrimary" fontSize="sm">
          Destination
        </Heading>
      </Card.Header>

      <ExpandableCardSection isExpanded={isCurrentStep} type="body">
        <Controller
          control={control}
          name="destinationAddress"
          render={({ field, fieldState }) => {
            const minLengthAddress = 40;

            const displayValue =
              !isFocused && field?.value?.length > minLengthAddress
                ? AddressUtils.format(field?.value ?? '')
                : field?.value;

            return (
              <Field.Root invalid={fieldState.invalid} paddingTop={0}>
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
                    value={displayValue}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Enter address"
                    variant="subtle"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
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
          <Button w="full" onClick={handleContinue}>
            Continue
          </Button>
        )}
      </ExpandableCardSection>
    </Card.Root>
  );
}
