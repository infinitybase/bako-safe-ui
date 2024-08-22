import { MinimalAlertIcon } from '@/components';
import {
  Avatar,
  Card,
  Divider,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { TransactionWithVault } from '@/modules/transactions/services';

export interface IConnectorInfos {
  transaction: TransactionWithVault;
  isPending: boolean;
  isNotSigned: boolean;
}

const ConnectorInfos = ({
  transaction,
  isPending,
  isNotSigned,
}: IConnectorInfos) => {
  return (
    <Card
      bgColor="grey.825"
      borderColor="grey.925"
      borderRadius={10}
      w={{ base: 'full', xs: 'unset' }}
      px={5}
      py={{ base: 2, xs: 4 }}
      borderWidth="1px"
      mt={4}
    >
      <Text color="grey.550" fontSize="xs">
        Requesting a transaction from:
      </Text>

      <Divider borderColor="grey.950" my={4} />

      <HStack width="100%" alignItems="center" spacing={4} h="32px">
        <Avatar
          borderRadius="6.4px"
          color="white"
          bgColor="dark.950"
          name={transaction?.predicate?.name}
          size="sm"
        />
        <VStack alignItems="flex-start" spacing={0}>
          <Text
            variant="subtitle"
            fontSize="14px"
            color="grey.250"
            textTransform="capitalize"
          >
            {transaction.summary?.type}
          </Text>
          <Text color="brand.500" variant="description" fontSize="xs">
            {transaction.summary?.type === 'connector' &&
              transaction.summary.origin}
            {/* bakoconnector-git-gr-featbakosafe-infinity-base.vercel.app */}
          </Text>
        </VStack>
      </HStack>
      {isPending && isNotSigned && (
        <HStack
          bg="#FFC01026"
          borderColor="#FFC0104D"
          borderWidth="1px"
          borderRadius={10}
          mt={{ base: 4, xs: 8 }}
          py={4}
          px={4}
        >
          <Icon
            as={MinimalAlertIcon}
            color="warning.600"
            fontSize={28}
            mt={-7}
          />

          <VStack spacing={0} alignItems="flex-start">
            <Text fontWeight="bold" color="#FFC010" fontSize="sm">
              Double check it!
            </Text>
            <Text color="#EED07C" fontSize="xs">
              Please carefully review this externally created transaction before
              approving it.
            </Text>
          </VStack>
        </HStack>
      )}
    </Card>
  );
};
export { ConnectorInfos };
