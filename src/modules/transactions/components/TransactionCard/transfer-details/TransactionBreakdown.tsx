import { Box, Separator, Stack, Text } from 'bako-ui';
import { TransactionStatus } from 'bakosafe';
import { memo, useMemo } from 'react';

import { LayerSwapIcon, RigContractIcon } from '@/components';
import { miraData } from '@/config/swap';
import { AddressUtils, type TransactionState } from '@/modules/core';
import { tokensIDS } from '@/modules/core/utils/assets/address';
import { FIAT_CURRENCIES } from '@/modules/core/utils/fiat-currencies';
import { useVerifyTransactionInformations } from '@/modules/transactions/hooks/details/useVerifyTransactionInformations';
import { TransactionTypeBridge } from '@/modules/transactions/services';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { FUEL_ETH_ID } from '@/utils/constants';

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

const TransactionBreakdown = memo(
  ({ transaction, status }: ITransactionBreakdown) => {
    const { isFromConnector, isContract, isPending, isDeploy, isMint, isSwap } =
      useVerifyTransactionInformations(transaction);

    const {
      screenSizes: { isMobile, isLowerThanFourHundredAndThirty },
      tokensUSD,
    } = useWorkspaceContext();

    const isNotSigned = useMemo(
      () => !status?.isDeclined && !status?.isSigned,
      [status],
    );

    const showContractAddresses = useMemo(
      () => (isDeploy || isContract) && !isMint,
      [isContract, isDeploy, isMint],
    );

    const isLiquidStake = useMemo(
      () =>
        transaction.name === 'Liquid Stake' &&
        transaction.assets[0].assetId === tokensIDS.FUEL,
      [transaction],
    );

    const isBridge = useMemo(
      () => transaction.type === TransactionTypeBridge.BRIDGE,
      [transaction.type],
    );

    const gasUsedInUSD = useMemo(() => {
      const rate = tokensUSD.data[FUEL_ETH_ID]?.usdAmount || 0;
      const gasUsed = transaction.gasUsed ? parseFloat(transaction.gasUsed) : 0;
      const value = rate * gasUsed;
      return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    }, [tokensUSD.data, transaction.gasUsed]);

    return (
      <Box
        display="flex"
        flexDirection={{ base: 'row', sm: 'column' }}
        w="full"
        minW={{ base: 200, sm: '60%' }}
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

        <Box mb={4} mt={{ base: 3, md: 0 }}>
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
            <ContractAddresses transaction={transaction} />
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
          <Stack gap={3}>
            <Text color="gray.400" fontSize="xs">
              Gas Fee
            </Text>
            <Text color="textPrimary" fontSize="xs">
              {transaction.gasUsed} ETH{' '}
              <Text as="span" fontSize="xs" color="gray.400">
                {gasUsedInUSD}
              </Text>
            </Text>
          </Stack>
        </Box>
      </Box>
    );
  },
);

TransactionBreakdown.displayName = 'TransactionBreakdown';

export { TransactionBreakdown };
