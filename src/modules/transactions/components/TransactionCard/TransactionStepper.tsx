import {
  Box,
  Step,
  StepDescription,
  StepIndicator,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  useSteps,
} from '@chakra-ui/react';
import { useEffect } from 'react';

import { useAddressBook } from '@/modules/addressBook';
import { useAuth } from '@/modules/auth';
import { AddressUtils } from '@/modules/core';

import { ITransactionHistory, TransactionHistoryType } from '../../services';

interface TransactionStepperProps {
  steps: ITransactionHistory[];
}

const TransactionTypeFormatter = (
  history: ITransactionHistory,
  account: string,
) => {
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

const TransactionStepper = ({ steps }: TransactionStepperProps) => {
  const { account } = useAuth();

  const { contactByAddress } = useAddressBook();
  const { activeStep, setActiveStep } = useSteps({
    index: steps?.length,
    count: steps?.length,
  });

  const isDeclined = steps?.find(
    (steps) => steps.type === TransactionHistoryType.DECLINE,
  );
  const lastStep = steps?.length - 1;

  useEffect(() => {
    if (lastStep && isDeclined) {
      setActiveStep(lastStep + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps?.length]);

  return (
    <Box display="flex" flexDirection="column" gap={8}>
      <Text color="grey.200" fontWeight="medium">
        TransactionHistory
      </Text>

      <Stepper
        index={isDeclined ? activeStep : steps?.length}
        orientation="vertical"
        h="full"
        w="full"
        minW="full"
        size="xs"
        maxH="full"
        gap={0}
        colorScheme="grey"
      >
        {steps?.map((step, index, test) => {
          const nickname = contactByAddress(step.owner.address)?.nickname;
          const declined = step.type === TransactionHistoryType.DECLINE;
          const sended = step.type === TransactionHistoryType.SEND;
          console.log(test.length - 1);

          return (
            <Step
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              <StepIndicator rounded={5}>
                <StepStatus
                  key={index}
                  complete={
                    declined && test.length - 1 ? (
                      <Box bgColor="error.500" boxSize={4} rounded={5} />
                    ) : sended && lastStep ? (
                      <Box bgColor="brand.500" boxSize={4} rounded={5} />
                    ) : (
                      <Box bgColor="grey.400" boxSize={4} rounded={5} />
                    )
                  }
                />
              </StepIndicator>

              <StepSeparator />
              <Box
                pos="relative"
                top={-6}
                maxH="fit-content"
                w="220px"
                display="flex"
                ml={2}
                flexDir="column"
                justifyContent="center"
                borderBottom="1px solid grey"
              >
                <Box py={4}>
                  <StepTitle
                    style={{
                      fontSize: '16px',
                      display: 'flex',
                      gap: '4px',
                    }}
                  >
                    {nickname && <Text>{nickname}</Text>}
                    <Text>{TransactionTypeFormatter(step, account)}</Text>
                    {!nickname && (
                      <Text variant="subtitle">
                        {step.owner.address !== account &&
                          AddressUtils.format(`(${step.owner.address})`)}
                      </Text>
                    )}
                  </StepTitle>
                  <StepDescription
                    style={{
                      fontSize: '14px',
                      color: 'grey.200',
                    }}
                  >
                    <Text variant="description">
                      {new Date(step.date).toDateString() +
                        ' ' +
                        new Date(step.date).toLocaleTimeString()}
                    </Text>
                  </StepDescription>
                </Box>
              </Box>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export { TransactionStepper };
