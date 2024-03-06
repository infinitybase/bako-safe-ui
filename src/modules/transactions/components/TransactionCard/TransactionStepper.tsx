import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
} from '@chakra-ui/react';

import { ITransactionHistory, TransactionHistoryType } from '../../services';

interface TransactionStepperProps {
  steps: ITransactionHistory[];
}

const TransactionTypeFormatter = (type: string) => {
  switch (type) {
    case TransactionHistoryType.CREATED:
      return 'Created';
    case TransactionHistoryType.SEND:
      return 'Sent';
    case TransactionHistoryType.SIGN:
      return 'Signed';
  }
};

const TransactionStepper = ({ steps }: TransactionStepperProps) => {
  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Text color="grey.200" fontWeight="medium">
        TransactionHistory
      </Text>

      <Stepper
        index={4}
        orientation="vertical"
        h="220px"
        size="sm"
        maxH="full"
        gap={0}
        colorScheme="success"
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
            <StepIndicator bg="grey.400" rounded={5}>
              <StepStatus key={index} complete={<StepIcon color="black" />} />
            </StepIndicator>

            <StepSeparator />
            <Box>
              <StepTitle
                style={{
                  fontSize: '16px',
                }}
              >
                {TransactionTypeFormatter(step.type)}
              </StepTitle>
              <StepDescription
                style={{
                  fontSize: '14px',
                }}
              >
                {new Date(step.date)
                  .toString()
                  .split(' ')
                  .slice(0, 5)
                  .join(' ')}
              </StepDescription>
            </Box>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export { TransactionStepper };
