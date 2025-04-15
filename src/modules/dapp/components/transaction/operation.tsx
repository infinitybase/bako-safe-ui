import { Avatar, HStack, Text, VStack } from '@chakra-ui/react';

import { useNetworks } from '@/modules/network/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { formatAssetAmount } from '@/utils';

import { UseTransactionSocket } from '../../hooks';
import { SimplifiedOperation } from '../../services/simplify-transaction';

interface OperationProps {
  vault?: UseTransactionSocket['vault'];
  operation?: SimplifiedOperation;
}

const formatUsdValue = (amount: string, price?: number) => {
  if (!price) return '$0.00';
  const value = parseFloat(amount) * price;
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const DappTransactionOperation = ({ vault, operation }: OperationProps) => {
  const { assetsMap, fuelsTokens, tokensUSD } = useWorkspaceContext();
  const { currentNetwork } = useNetworks();
  const { to, assetsToFrom, from } = operation ?? {};
  if (!to || !from || !vault || !operation) return null;

  // Processa os assets
  const processedAssets = assetsToFrom?.map((sent) => {
    const assetInfo = assetsMap?.[sent.assetId] || {
      name: 'Unknown',
      symbol: 'UNKNOWN',
      icon: '',
      decimals: 18,
    };

    const amount = formatAssetAmount({
      fuelsTokens,
      chainId: currentNetwork.chainId,
      assetId: sent.assetId,
      amount: sent.amount,
    });

    const usdPrice = tokensUSD.data?.[sent.assetId]?.usdAmount;
    const usdValue = formatUsdValue(amount, usdPrice);

    return {
      ...assetInfo,
      amount,
      usdValue,
      assetId: sent.assetId,
    };
  });

  const bech32Address = vault.address;
  const isVault = bech32Address === vault?.address;
  const title = isVault ? vault?.name : 'Unknown';
  //const primaryAsset = processedAssets?.[0];
  console.log(operation, processedAssets);
  return (
    <VStack>
      <HStack>
        <Avatar
          mb={2}
          name={title}
          bgColor="grey.950"
          variant="roundedSquare"
          boxSize="40px"
          fontSize="xs"
          color="white"
        />
        <VStack>
          {' '}
          <Text
            textAlign="center"
            variant="title"
            fontSize="sm"
            mb={1}
            noOfLines={1}
          >
            {title}
          </Text>
          <Text
            textAlign="center"
            variant="description"
            fontSize="xs"
            color="grey.250"
            mb={1}
            noOfLines={1}
          >
            {vault.address}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
};

export { DappTransactionOperation };
