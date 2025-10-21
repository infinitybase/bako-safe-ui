import { Flex, Image, Stack, Text } from 'bako-ui';
import { memo, useMemo } from 'react';

import { Asset, useGetTokenInfos } from '@/modules/core';
import { useGetUSDValue } from '@/modules/vault/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { moneyFormat } from '@/utils/money-format';

interface AssetItemProps {
  asset: Asset;
}

const AssetItem = memo(({ asset }: AssetItemProps) => {
  const { assetsMap } = useWorkspaceContext();
  const { assetAmount, assetsInfo: assetInfo } = useGetTokenInfos({
    ...asset,
    assetsMap,
  });
  const usdAmount = useGetUSDValue(asset.assetId);

  const balanceInUSD = useMemo(
    () => Number(assetAmount.replace(/,/g, '')) * (usdAmount ?? 0),
    [assetAmount, usdAmount],
  );

  const balanceInCurrency = moneyFormat(balanceInUSD.toString());

  return (
    <Flex
      justify="space-between"
      align="center"
      py={4}
      borderTop="1px solid"
      _last={{
        borderBottom: '1px solid',
        borderBottomColor: 'bg.muted',
      }}
      borderColor="bg.muted"
    >
      <Flex gap={2}>
        <Image
          src={assetInfo?.icon}
          alt={assetInfo?.name}
          w={5}
          h={5}
          rounded="full"
        />
        <Text fontSize="sm" color="textSecondary" lineHeight="1">
          {assetInfo?.slug}
        </Text>
      </Flex>
      <Stack gap={3} align="end">
        <Text color="textPrimary" fontSize="sm" lineHeight="1">
          {assetAmount}
        </Text>
        <Text fontSize="sm" color="textSecondary" lineHeight="1">
          {balanceInCurrency}
        </Text>
      </Stack>
    </Flex>
  );
});

AssetItem.displayName = 'AssetItem';

export default AssetItem;
