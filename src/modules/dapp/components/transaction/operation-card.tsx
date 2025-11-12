import { useClipboard, VStack } from 'bako-ui';
import { useMemo } from 'react';

import { UseTransactionSocket } from '../../hooks';
import {
  SimplifiedOperation,
  TxCategory,
} from '../../services/simplify-transaction';
import { OperationAddressDisplay } from './operation-address-display';
import { OperationArrowDisplay } from './operation-arrow-display';
import { OperationAssetDisplay } from './operation-asset-display';

interface DappTransactionOperationCardProps {
  operation: SimplifiedOperation;
  vault?: UseTransactionSocket['vault'];
}

export const DappTransactionOperationCard = (
  props: DappTransactionOperationCardProps,
) => {
  const { operation, vault } = props;

  const { copy, copied } = useClipboard({ value: vault?.address || '' });

  const isContract = operation.type === TxCategory.CONTRACTCALL;
  const hasAssetsComingBack = useMemo(
    () => operation.assetsToFrom?.some((a) => a.amount.gt(0)),
    [operation.assetsToFrom],
  );

  return (
    <VStack gap={1} w="full">
      <OperationAddressDisplay
        address={operation.from.address}
        name={
          operation.isFromCurrentAccount ? vault?.name || 'Vault' : undefined
        }
        isCurrentAccount={operation.isFromCurrentAccount ?? false}
        vaultAddress={vault?.address}
        onCopy={copy}
        hasCopied={copied}
      />

      {!isContract && <OperationAssetDisplay assets={operation.assets} />}

      <OperationArrowDisplay
        label={isContract ? 'Calling contract' : 'Sending funds'}
      />

      <OperationAddressDisplay
        address={operation.to.address}
        name={operation.isToCurrentAccount ? vault?.name || 'Vault' : undefined}
        isCurrentAccount={operation.isToCurrentAccount ?? false}
        vaultAddress={vault?.address}
        onCopy={copy}
        hasCopied={copied}
      />

      {hasAssetsComingBack && (
        <>
          <OperationAssetDisplay assets={operation.assetsToFrom} />

          <OperationArrowDisplay label="Sends funds" />

          <OperationAddressDisplay
            address={operation.from.address}
            name={
              operation.isFromCurrentAccount
                ? vault?.name || 'Vault'
                : undefined
            }
            isCurrentAccount={operation.isFromCurrentAccount ?? false}
            vaultAddress={vault?.address}
            onCopy={copy}
            hasCopied={copied}
          />
        </>
      )}
    </VStack>
  );
};
