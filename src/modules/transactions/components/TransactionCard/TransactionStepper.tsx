import {
  Box,
  Step,
  StepDescription,
  StepIndicator,
  Stepper,
  StepSeparator,
  StepTitle,
} from '@chakra-ui/react';

import { ITransactionHistory } from '../../services';

interface TransactionStepperProps {
  steps: ITransactionHistory[];
}

const TransactionStepper = ({ steps }: TransactionStepperProps) => {
  return (
    <Stepper
      index={steps?.length}
      orientation="vertical"
      h="240px"
      size="xs"
      maxH="full"
      gap="0"
      colorScheme="success"
      w="full"
    >
      {steps?.map((step, index) => (
        <Step key={index}>
          <StepIndicator rounded={5} />

          <Box>
            <StepTitle
              style={{
                fontSize: '16px',
              }}
            >
              {step.type}
            </StepTitle>
            <StepDescription
              style={{
                fontSize: '14px',
              }}
            >
              {new Date(step.date).toString().split(' ').slice(0, 5).join(' ')}
            </StepDescription>
          </Box>
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
};

export { TransactionStepper };
