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
      return 'Execution';
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
    case history.type === TransactionHistoryType.CANCEL:
      return 'Canceled';
    case history.type === TransactionHistoryType.FAILED:
      return 'Failed';
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
      <Text color="grey.425" fontSize="sm">
        Transaction History
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
        {steps?.map((step, index) => {
          const nickname = contactByAddress(step.owner.address)?.nickname;
          const declined = step.type === TransactionHistoryType.DECLINE;
          const failed = step.type === TransactionHistoryType.FAILED;
          const canceled = step.type === TransactionHistoryType.CANCEL;
          const sended = step.type === TransactionHistoryType.SEND;

          const badOptions = (declined || failed || canceled) && lastStep;

          return (
            <Step
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <StepIndicator rounded={5}>
                <StepStatus
                  key={index}
                  complete={
                    badOptions ? (
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
                display="flex"
                ml={2}
                flexDir="column"
                justifyContent="center"
                borderColor="grey.950"
                borderBottomWidth={1}
                borderTopWidth={index === 0 ? 1 : 0}
                w="100%"
              >
                <Box py={4}>
                  <StepTitle
                    style={{
                      fontSize: '16px',
                      display: 'flex',
                      gap: '4px',
                    }}
                  >
                    {nickname && step.owner.address !== account && (
                      <Text>{nickname}</Text>
                    )}
                    <Text
                      color={
                        failed
                          ? 'error.500'
                          : step.type === TransactionHistoryType.SEND
                          ? 'brand.500'
                          : 'grey.75'
                      }
                      fontSize="sm"
                    >
                      {TransactionTypeFormatter(step, account)}
                    </Text>
                    {!nickname && (
                      <Text variant="subtitle" color="grey.425">
                        {step.owner.address !== account &&
                          AddressUtils.format(`(${step.owner.address})`)}
                      </Text>
                    )}
                  </StepTitle>
                  <StepDescription
                    style={{
                      fontSize: '14px',
                      color: 'grey.425',
                    }}
                  >
                    <Text variant="description" color="grey.425" fontSize="xs">
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
