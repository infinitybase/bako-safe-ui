import { Box, HStack, Text } from '@chakra-ui/react';

import { AddressType } from '@fuel-wallet/types';
import { TransactionStatus, TransactionType } from 'bakosafe';
import { Address } from 'fuels';

import { AddressUtils, TransactionState } from '@/modules/core';
import { AssetBoxInfo, TransactionUI } from '../Details';
import { ContractInfos } from './ContractInfos';
import { DeploymentInfo } from './DeploymentInfos';

interface ITransactionBreakdown {
  transaction: TransactionUI;
  status: TransactionState | undefined;
}

const TransactionBreakdown = ({
  transaction,
  status,
}: ITransactionBreakdown) => {
  const fromConnector = !!transaction?.summary;

  const mainOperation = transaction?.summary?.operations?.[0];
  const isContract = mainOperation?.to?.type === AddressType.contract;
  const hasToken = !!mainOperation?.assetsSent?.length;
  const isPending = transaction.status === TransactionStatus.AWAIT_REQUIREMENTS;
  const isNotSigned = !status?.isDeclined && !status?.isSigned;
  const isDeploy = transaction.type === TransactionType.TRANSACTION_CREATE;
  const isDeposit = transaction.type === TransactionType.DEPOSIT;

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
        mb={fromConnector ? 4 : 0}
        w={{ base: 'full', xs: 'unset' }}
      >
        {transaction.assets.map((asset, index) => (
          <>
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
              borderBottomWidth={
                index === transaction.assets.length - 1 ? 1 : 0
              }
              hasToken={hasToken}
            />
            {isContract && !isDeploy && (
              <AssetBoxInfo
                borderTop="none"
                isContract={false}
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
                borderBottomWidth={
                  index === transaction.assets.length - 1 ? 1 : 0
                }
                hasToken={hasToken}
              />
            )}
          </>
        ))}
        {isContract && !isDeploy && !transaction.assets.length && (
          <AssetBoxInfo
            isDeposit={isDeposit}
            contractAddress={Address.fromB256(
              mainOperation?.to?.address ?? '',
            ).toString()}
            borderColor={'transparent'}
            hasToken={hasToken}
          />
        )}
      </Box>

      {isContract && !isDeploy && (
        <ContractInfos
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
