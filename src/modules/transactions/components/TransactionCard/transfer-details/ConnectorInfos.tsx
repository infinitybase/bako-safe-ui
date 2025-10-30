import { Alert, Avatar, Card, HStack, Stack, Text, VStack } from 'bako-ui';

import { MinimalAlertIcon } from '@/components';
import { TransactionWithVault } from '@/modules/transactions/services';

export interface IConnectorInfos {
  transaction: TransactionWithVault;
  isPending: boolean;
  isNotSigned: boolean;
}

export enum ETransactionSummaryNames {
  FUEL = 'Fuel Connectors',
  SPARK = 'Spark | Faucet',
}

const ConnectorInfos = ({
  transaction,
  isPending,
  isNotSigned,
}: IConnectorInfos) => {
  // @ts-expect-error -- fix later
  const txSummaryName = transaction.summary?.['name'];
  const originName =
    txSummaryName === ETransactionSummaryNames.FUEL
      ? 'Connector'
      : txSummaryName === ETransactionSummaryNames.SPARK
        ? 'SPARK'
        : txSummaryName;

  return (
    <Stack gap={4} w="full">
      <Text fontSize="xs" color="gray.400" fontWeight="medium">
        Requesting a transaction from:
      </Text>
      <Card.Root variant="subtle" borderRadius="lg" w="full">
        <Card.Body p={4}>
          <HStack
            width="100%"
            alignItems={{ base: 'flex-start', sm: 'center' }}
            gap={3.5}
            flexDirection={{ base: 'column', sm: 'row' }}
          >
            <HStack alignItems="center" gap={3.5} flexShrink={0}>
              <Avatar
                borderRadius="6.4px"
                color="white"
                name={transaction?.predicate?.name}
                size="sm"
              />
              <VStack alignItems="flex-start" gap={2}>
                <Text
                  color="gray.200"
                  fontSize="xs"
                  fontWeight="medium"
                  lineHeight="shorter"
                  truncate
                  textTransform="capitalize"
                >
                  {originName}
                </Text>
                <Text
                  color="gray.400"
                  fontSize="xs"
                  lineHeight="shorter"
                  truncate
                >
                  {transaction.summary?.type === 'connector' &&
                    transaction.summary.origin}
                </Text>
              </VStack>
            </HStack>
            {isPending && isNotSigned && (
              <Alert.Root
                status="warning"
                variant="subtle"
                bg="primary.main/5"
                color="primary.main"
                p={3}
                rounded="sm"
              >
                <Alert.Indicator alignSelf="center">
                  <MinimalAlertIcon />
                </Alert.Indicator>
                <Alert.Content>
                  <Alert.Description>
                    Please carefully review this externally created transaction
                    before approving it.
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}
          </HStack>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
};
export { ConnectorInfos };
