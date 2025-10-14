import { Box } from 'bako-ui';
import { OperationName } from 'fuels';
import React from 'react';

import { useVerifyTransactionInformations } from '@/modules/transactions/hooks';
import { TransactionWithVault } from '@/modules/transactions/services';

import { AssetBoxInfo } from '../../AssetBoxInfo';
import { ContractAddresses } from '../contract-call/ContractAddresses';

interface MintTokenProps {
  transaction: TransactionWithVault;
}

const MintTokenInfos = ({ transaction }: MintTokenProps) => {
  const { isDeploy, isDeposit } = useVerifyTransactionInformations(transaction);

  const operations = transaction.summary?.operations;
  if (!operations) {
    return null;
  }

  return (
    <Box
      alignItems="flex-start"
      flexWrap="wrap"
      w={{ base: 'full', sm: 'unset' }}
    >
      {operations.map((operation, index) => {
        const { assetsSent, to, name } = operation;

        return (
          <React.Fragment key={index}>
            {name && name === 'Contract call' && !assetsSent && (
              <ContractAddresses
                transaction={transaction}
                borderColor="grey.950"
                borderBottomWidth={1}
              />
            )}

            {assetsSent?.map((asset, assetIndex) => (
              <AssetBoxInfo
                isContract={operation.name === OperationName.contractCall}
                isDeploy={isDeploy}
                isDeposit={isDeposit}
                key={`${index}-${assetIndex}`}
                asset={{
                  assetId: asset.assetId,
                  amount: asset.amount.toString(),
                  to: to?.address ?? '',
                  transactionID: transaction.id,
                }}
                borderColor="grey.950"
                borderBottomWidth={assetIndex === assetsSent.length - 1 ? 1 : 0}
              />
            ))}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default MintTokenInfos;
