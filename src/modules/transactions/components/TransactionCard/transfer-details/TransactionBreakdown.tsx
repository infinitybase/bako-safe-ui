import { Box, HStack, Separator, Text } from 'bako-ui';
import { TransactionStatus } from 'bakosafe';
import { useMemo } from 'react';

import { LayerSwapIcon, RigContractIcon } from '@/components';
import { miraData } from '@/config/swap';
import { AddressUtils, type TransactionState } from '@/modules/core';
import { tokensIDS } from '@/modules/core/utils/assets/address';
import { FIAT_CURRENCIES } from '@/modules/core/utils/fiat-currencies';
import { useVerifyTransactionInformations } from '@/modules/transactions/hooks/details/useVerifyTransactionInformations';
import { TransactionTypeBridge } from '@/modules/transactions/services';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { TransactionCard } from '..';
import { AssetBoxInfo, type TransactionUI } from '../Details';
import BridgeCardDetail from './bridge/bridge';
import { ConnectorInfos } from './ConnectorInfos';
import { ContractAddresses } from './contract-call/ContractAddresses';
import MintTokenInfos from './mint-token/MintToken';

interface ITransactionBreakdown {
  transaction: TransactionUI;
  status: TransactionState | undefined;
}

const TransactionBreakdown = ({
  transaction,
  status,
}: ITransactionBreakdown) => {
  const { isFromConnector, isContract, isPending, isDeploy, isMint, isSwap } =
    useVerifyTransactionInformations(transaction);

  const {
    screenSizes: { isMobile, isLowerThanFourHundredAndThirty },
  } = useWorkspaceContext();

  const isNotSigned = !status?.isDeclined && !status?.isSigned;

  const showContractAddresses = (isDeploy || isContract) && !isMint;

  const isLiquidStake =
    transaction.name === 'Liquid Stake' &&
    transaction.assets[0].assetId === tokensIDS.FUEL;

  const isBridge = useMemo(
    () => transaction.type === TransactionTypeBridge.BRIDGE,
    [transaction.type],
  );

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'row', sm: 'column' }}
      w="full"
      minW={{ base: 200, sm: '476px' }}
      flexWrap="wrap"
    >
      {isFromConnector && !isDeploy && isMobile && (
        <ConnectorInfos
          transaction={transaction}
          isNotSigned={isNotSigned}
          isPending={isPending}
        />
      )}

      {isMobile && <Separator my={6} borderColor="gray.400" />}

      <Box mb={4}>
        <Text
          color="gray.400"
          fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
        >
          Transaction breakdown
        </Text>
      </Box>

      <Box
        mb={isFromConnector ? 4 : 0}
        w={{ base: 'full', sm: 'unset' }}
        display="flex"
        flexDirection="column"
        gap={1}
      >
        {!isContract &&
          transaction.assets.map((asset, index) => (
            <AssetBoxInfo
              key={`${index} - ${asset.assetId}`}
              asset={{
                assetId: asset.assetId,
                amount: asset.amount,
                to: asset.to,
                transactionID: transaction.id,
                recipientNickname: AddressUtils.format(
                  asset?.recipientNickname ?? '',
                ),
              }}
              isFiatCurrency={FIAT_CURRENCIES.has(asset.assetId)}
              rampTransaction={transaction.rampTransaction}
            />
          ))}

        {showContractAddresses && (
          <ContractAddresses transaction={transaction} borderColor="grey.950" />
        )}
        {isBridge && <BridgeCardDetail transaction={transaction} />}
        {isMint && !isBridge && <MintTokenInfos transaction={transaction} />}
      </Box>

      {isFromConnector && !isDeploy && !isMobile && (
        <ConnectorInfos
          transaction={transaction}
          isNotSigned={isNotSigned}
          isPending={isPending}
        />
      )}

      {isSwap && (
        <TransactionCard.TransactionRequestFrom
          name={miraData.name}
          origin={miraData.origin}
          icon={miraData.icon}
          mt={4}
        />
      )}

      {isLiquidStake && (
        <Box mt={4} w={'full'}>
          <TransactionCard.TransactionRequestFrom
            name={'Liquid stake via RIG'}
            origin={'https://rig.st/'}
            icon={RigContractIcon}
          />
        </Box>
      )}

      {isBridge && (
        <Box mt={4} w={'full'}>
          <TransactionCard.TransactionRequestFrom
            name={'Layerswap.app'}
            origin={'https://layerswap.io/'}
            icon={LayerSwapIcon}
          />
        </Box>
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
