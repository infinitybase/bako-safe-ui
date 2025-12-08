import { Box, Separator, Steps, Text, useSteps } from 'bako-ui';
import { AddressUtils as BakoAddressUtils, Bech32Prefix } from 'bakosafe';
import { parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { memo, useEffect, useMemo } from 'react';

import { AddressUtils } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

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
    case history.owner.address === account &&
      history.type === TransactionHistoryType.CANCEL:
      return 'You Canceled';
    case history.type === TransactionHistoryType.CANCEL:
      return 'Canceled';
    case history.type === TransactionHistoryType.FAILED:
      return 'Failed';
  }
};

const TransactionStepper = memo(({ steps }: TransactionStepperProps) => {
  const {
    authDetails: { userInfos },
    addressBookInfos: {
      handlers: { contactByAddress },
    },
    screenSizes: { isLowerThanFourHundredAndThirty },
  } = useWorkspaceContext();

  const { value: activeStep, setStep: setActiveStep } = useSteps({
    // index: steps?.length,
    count: steps?.length,
  });

  const isDeclined = useMemo(
    () => steps?.find((steps) => steps.type === TransactionHistoryType.DECLINE),
    [steps],
  );
  const lastStep = steps?.length - 1;

  useEffect(() => {
    if (lastStep && isDeclined) {
      setActiveStep(lastStep + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps?.length]);

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Text
        color="gray.400"
        fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
        mb="7px"
      >
        Transaction History
      </Text>

      <Steps.Root
        step={isDeclined ? activeStep : steps?.length}
        orientation="vertical"
        h="full"
        w="full"
        size="xs"
        gap={0}
        bg="gray.600"
        rounded="lg"
        p={4}
      >
        <Steps.List w="full">
          {steps?.map((step, index) => {
            const nickname = contactByAddress(step.owner.address)?.nickname;
            const declined = step.type === TransactionHistoryType.DECLINE;
            const failed = step.type === TransactionHistoryType.FAILED;
            const canceled = step.type === TransactionHistoryType.CANCEL;
            const sended = step.type === TransactionHistoryType.SEND;

            const badOptions = (declined || failed || canceled) && lastStep;

            return (
              <Steps.Item
                key={index}
                index={index}
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  '--steps-size': '8px',
                }}
              >
                <Steps.Indicator rounded="2xs">
                  <Steps.Status
                    complete={
                      badOptions ? (
                        <Box bgColor="error.500" boxSize="8px" />
                      ) : sended && lastStep ? (
                        <Box bgColor="primary.main" boxSize="8px" />
                      ) : (
                        <Box bgColor="gray.500" boxSize="8px" />
                      )
                    }
                    incomplete={<Box bgColor="gray.500" boxSize="8px" />}
                  />
                </Steps.Indicator>
                <Box
                  display="flex"
                  ml={2}
                  alignItems="center"
                  w="100%"
                  py={4}
                  gap={4}
                  justifyContent="space-between"
                >
                  <Steps.Title
                    style={{
                      fontSize: '16px',
                      display: 'flex',
                      gap: '4px',
                    }}
                  >
                    {nickname && step.owner.address !== userInfos.address && (
                      <Text
                        fontSize="sm"
                        color="gray.200"
                        truncate
                        textOverflow="ellipsis"
                        maxW={{ base: '150px', sm: '95px', xl: 'full' }}
                      >
                        {step.type !== TransactionHistoryType.SEND && nickname}
                      </Text>
                    )}
                    <Text
                      color={
                        failed
                          ? 'error.500'
                          : step.type === TransactionHistoryType.SEND
                            ? 'brand.500'
                            : 'gray.200'
                      }
                      fontSize="sm"
                    >
                      {TransactionTypeFormatter(step, userInfos.address)}
                    </Text>
                    {!nickname &&
                      step.type !== TransactionHistoryType.SEND &&
                      step.owner.type === 'WEB_AUTHN' && (
                        <Text fontSize="sm" color="grey.425">
                          {step.owner.address !== userInfos.address
                            ? `(${AddressUtils.format(AddressUtils.toBech32(step.owner.address, Bech32Prefix.PASSKEY))})`
                            : null}
                        </Text>
                      )}

                    {!nickname &&
                      step.type !== TransactionHistoryType.SEND &&
                      step.owner.type === 'SOCIAL' && (
                        <Text fontSize="sm" color="grey.425">
                          {step.owner.address !== userInfos.address
                            ? `(${AddressUtils.format(AddressUtils.toBech32(step.owner.address, Bech32Prefix.SOCIAL))})`
                            : null}
                        </Text>
                      )}

                    {!nickname &&
                      step.type !== TransactionHistoryType.SEND &&
                      step.owner.type === 'EVM' && (
                        <Text fontSize="sm" color="grey.425">
                          {step.owner.address !== userInfos.address
                            ? AddressUtils.format(
                                `(eth:${BakoAddressUtils.parseFuelAddressToEth(step.owner.address)})`,
                              )
                            : null}
                        </Text>
                      )}

                    {!nickname &&
                      step.type !== TransactionHistoryType.SEND &&
                      step.owner.type !== 'WEB_AUTHN' &&
                      step.owner.type !== 'SOCIAL' &&
                      step.owner.type !== 'EVM' && (
                        <Text fontSize="sm" color="grey.425">
                          {step.owner.address !== userInfos.address
                            ? `(${AddressUtils.format(step.owner.address)})`
                            : null}
                        </Text>
                      )}
                  </Steps.Title>

                  <Separator borderColor="gray.550" flex={1} />

                  <Steps.Description flex={2}>
                    <Text color="gray.400" fontSize="xs">
                      {formatInTimeZone(
                        parseISO(step.date),
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                        'EEE, do MMM, hh:mm a',
                        { locale: enUS },
                      )}
                    </Text>
                  </Steps.Description>
                </Box>

                <Steps.Separator
                  css={{
                    position: 'absolute',
                    width: '2px',
                    top: 'calc(30px)',
                    maxHeight: 'calc(100% - 8px)',
                    left: 'calc(4px - 1px)',
                    backgroundColor: 'gray.500',
                  }}
                />
              </Steps.Item>
            );
          })}
        </Steps.List>
      </Steps.Root>
    </Box>
  );
});

TransactionStepper.displayName = 'TransactionStepper';

export { TransactionStepper };
