import { Box, Divider, HStack, Text } from '@chakra-ui/react';
import { TransactionStatus } from 'bakosafe';

import { AddressUtils, TransactionState } from '@/modules/core';
import { useVerifyTransactionInformations } from '@/modules/transactions/hooks/details/useVerifyTransactionInformations';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { AssetBoxInfo, TransactionUI } from '../Details';
import { ConnectorInfos } from './ConnectorInfos';
import { ContractAddresses } from './contract-call/ContractAddresses';
import { DeploymentInfo } from './DeploymentInfos';
import MintTokenInfos from './mint-token/MintToken';

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
    isMint,
  } = useVerifyTransactionInformations(transaction);

  const {
    screenSizes: { isMobile, isLowerThanFourHundredAndThirty },
  } = useWorkspaceContext();

  const isNotSigned = !status?.isDeclined && !status?.isSigned;

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'row', xs: 'column' }}
      w="full"
      minW={{ base: 200, sm: '476px' }}
      flexWrap="wrap"
    >
      {isFromConnector && !isDeploy && isMobile && (
        <>
          <ConnectorInfos
            transaction={transaction}
            isNotSigned={isNotSigned}
            isPending={isPending}
          />
        </>
      )}

      {isMobile && <Divider my={6} borderColor="grey.425" />}

      <Box mb={isMobile ? 6 : 4}>
        <Text
          color="grey.425"
          fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
        >
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

        {isContract && !isMint && (
          <ContractAddresses
            transaction={transaction}
            borderColor="grey.950"
            borderBottomWidth={1}
          />
        )}
        {isMint && <MintTokenInfos transaction={transaction} />}
      </Box>

      {isFromConnector && !isDeploy && !isMobile && (
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
