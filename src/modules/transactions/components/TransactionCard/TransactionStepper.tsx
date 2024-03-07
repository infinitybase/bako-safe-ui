import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Link,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  useSteps,
} from '@chakra-ui/react';
import { useEffect } from 'react';

import { useAuth } from '@/modules/auth';
import { AddressUtils } from '@/modules/core';

import { ITransactionHistory, TransactionHistoryType } from '../../services';

interface TransactionStepperProps {
  steps: ITransactionHistory[];
}

const TransactionStepper = ({ steps }: TransactionStepperProps) => {
  const { account } = useAuth();
  const { activeStep, setActiveStep } = useSteps({
    index: steps?.length,
    count: steps?.length,
  });

  const isDeclined = steps?.find(
    (steps) => steps.type === TransactionHistoryType.DECLINE,
  );
  const lastStep = steps?.length - 1;

  const TransactionTypeFormatter = (history: ITransactionHistory) => {
    switch (true) {
      case history.owner.address === account &&
        history.type === TransactionHistoryType.CREATED:
        return 'You created';
      case history.owner.address !== account &&
        history.type === TransactionHistoryType.CREATED:
        return 'Created';
      case history.type === TransactionHistoryType.SEND:
        return 'Sent';
      case history.owner.address === account &&
        history.type === TransactionHistoryType.SIGN:
        return 'You signed';
      case history.owner.address !== account &&
        history.type === TransactionHistoryType.SIGN:
        return 'Signed';
      case history.owner.address === account &&
        history.type === TransactionHistoryType.DECLINE:
        return 'You declined';
      case history.owner.address !== account &&
        history.type === TransactionHistoryType.DECLINE:
        return `Declined`;
    }
  };

  useEffect(() => {
    if (lastStep && isDeclined) {
      setActiveStep(lastStep);
    }
  }, [steps?.length]);

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Text color="grey.200" fontWeight="medium">
        TransactionHistory
      </Text>

      <Stepper
        index={isDeclined ? activeStep : steps?.length}
        orientation="vertical"
        h="220px"
        size="sm"
        maxH="full"
        gap={0}
        colorScheme="grey"
      >
        {steps?.map((step, index) => (
          <Step
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <StepIndicator bg="grey.600" color="red" rounded={5}>
              <StepStatus
                key={index}
                complete={<StepIcon color="success.500" />}
                active={
                  isDeclined && <CloseIcon color="error.500" boxSize={3} />
                }
              />
            </StepIndicator>

            <StepSeparator />
            <Box>
              <StepTitle
                style={{
                  fontSize: '16px',
                }}
              >
                <Text as={Link} textDecor="none">
                  {TransactionTypeFormatter(step)}
                </Text>{' '}
                <Text as={Link} textDecor="none" variant="subtitle">
                  {step.owner.address !== account &&
                    AddressUtils.format(`(${step.owner.address})`)}
                </Text>
              </StepTitle>
              <StepDescription
                style={{
                  fontSize: '14px',
                  color: 'grey.200',
                }}
              >
                {new Date(step.date).toDateString() +
                  ' ' +
                  new Date(step.date).toLocaleTimeString()}
              </StepDescription>
            </Box>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export { TransactionStepper };
