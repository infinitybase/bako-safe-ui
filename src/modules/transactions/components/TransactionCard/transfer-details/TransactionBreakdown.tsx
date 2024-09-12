import { Box, HStack, Text } from '@chakra-ui/react';
import { TransactionStatus } from 'bakosafe';

import { AddressUtils, TransactionState } from '@/modules/core';
import { useVerifyTransactionInformations } from '@/modules/transactions/hooks/details/useVerifyTransactionInformations';

import { AssetBoxInfo, TransactionUI } from '../Details';
import { ConnectorInfos } from './ConnectorInfos';
import { ContractAddresses } from './contract-call/ContractAddresses';
import { DeploymentInfo } from './DeploymentInfos';

interface ITransactionBreakdown {
  transaction: TransactionUI;
  status: TransactionState | undefined;
}

const TransactionBreakdown = ({
  transaction,
  status,
}: ITransactionBreakdown) => {
  const {
    isFromConnector,
    isContract,
    mainOperation,
    hasToken,
    isPending,
    isDeploy,
    isDeposit,
  } = useVerifyTransactionInformations(transaction);

  const isNotSigned = !status?.isDeclined && !status?.isSigned;

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'row', xs: 'column' }}
      w="full"
      minW={{ base: 200, sm: '476px' }}
      flexWrap="wrap"
    >
      <Box mb={4}>
        <Text color="grey.425" fontSize="sm">
          Transaction breakdown
        </Text>
      </Box>

      <Box
        alignItems="flex-start"
        flexWrap="wrap"
        mb={isFromConnector ? 4 : 0}
        w={{ base: 'full', xs: 'unset' }}
      >
        {transaction.assets.map((asset, index) => (
          <AssetBoxInfo
            isContract={isContract}
            isDeploy={isDeploy}
            isDeposit={isDeposit}
            key={index}
            asset={{
              assetId: asset.assetId,
              amount: asset.amount,
              to: asset.to,
              transactionID: transaction.id,
              recipientNickname: AddressUtils.format(
                asset?.recipientNickname ?? '',
              ),
            }}
            borderColor="grey.950"
            borderBottomWidth={index === transaction.assets.length - 1 ? 1 : 0}
            hasToken={hasToken}
          />
        ))}

        {isContract && (
          <ContractAddresses
            transaction={transaction}
            borderColor="grey.950"
            borderBottomWidth={1}
          />
        )}
      </Box>

      {isFromConnector && !isDeploy && (
        <ConnectorInfos
          transaction={transaction}
          isNotSigned={isNotSigned}
          isPending={isPending}
        />
      )}

      {isDeploy && !!mainOperation && (
        <DeploymentInfo operation={mainOperation} />
      )}

      <Box
        w="full"
        hidden={transaction.status !== TransactionStatus.SUCCESS}
        mt={4}
      >
        <HStack gap={8} justifyContent="space-between">
          <Text color="grey.75" fontSize="xs">
            Gas Fee (ETH)
          </Text>
          <Text color="grey.75" fontSize="xs">
            -{transaction.gasUsed}
          </Text>
        </HStack>
      </Box>
    </Box>
  );
};
export { TransactionBreakdown };
