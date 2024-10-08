import { Box } from '@chakra-ui/react';
import { bn } from 'fuels';
import React from 'react';

import { useVerifyTransactionInformations } from '@/modules/transactions/hooks';
import { TransactionWithVault } from '@/modules/transactions/services';
import { isHex } from '@/utils';

import { AssetBoxInfo } from '../../AssetBoxInfo';
import { ContractAddresses } from '../contract-call/ContractAddresses';

interface MintTokenProps {
  transaction: TransactionWithVault;
}

const MintTokenInfos = ({ transaction }: MintTokenProps) => {
  const { isContract, isDeploy, isDeposit } =
    useVerifyTransactionInformations(transaction);

  const operations = transaction.summary?.operations;
  if (!operations) {
    return null;
  }

  return (
    <Box
      alignItems="flex-start"
      flexWrap="wrap"
      w={{ base: 'full', xs: 'unset' }}
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
                isContract={isContract}
                isDeploy={isDeploy}
                isDeposit={isDeposit}
                key={`${index}-${assetIndex}`}
                asset={{
                  assetId: asset.assetId,
                  amount: isHex(String(asset.amount))
                    ? bn(asset.amount).format()
                    : String(asset.amount),
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
