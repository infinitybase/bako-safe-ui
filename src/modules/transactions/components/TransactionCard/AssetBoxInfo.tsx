import { Icon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Center,
  HStack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';

import { DoubleArrowIcon } from '@/components';
import { DeployIcon } from '@/components/icons/tx-deploy';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import {
  AssetModel,
  assetsMap,
  IGetTokenInfos,
  useGetParams,
} from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { AddressWithCopyBtn } from './transfer-details';

interface AssetBoxInfoProps extends StackProps {
  asset?: AssetModel;
  contractAddress?: string;
  hasToken?: boolean;
  isDeposit?: boolean;
  isDeploy?: boolean;
  isContract?: boolean;
  contractAssetInfo?: IGetTokenInfos;
}

const AssetBoxInfo = ({
  asset,
  contractAddress,
  isDeposit,
  isDeploy,
  isContract,
  contractAssetInfo,
  ...props
}: AssetBoxInfoProps) => {
  const {
    tokensUSD,
    screenSizes: { isMobile, isLowerThanFourHundredAndThirty },
  } = useWorkspaceContext();
  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  const isVaultPage = !!vaultId;

  const assetInfo = useMemo(
    () => (asset?.assetId ? assetsMap[asset?.assetId] : null),
    [asset?.assetId],
  );

  const txUSDAmount = useTxAmountToUSD(
    [
      asset
        ? asset
        : {
            amount: contractAssetInfo?.assetAmount ?? '',
            assetId: contractAssetInfo?.assetsInfo.assetId ?? '',
          },
    ],
    tokensUSD?.isLoading,
    tokensUSD?.data,
  );

  return (
    <HStack
      py={2}
      spacing={{ base: 0, xs: 10 }}
      justifyContent={{ base: 'space-between' }}
      w="full"
      borderTopWidth={1}
      {...props}
    >
      {assetInfo && (
        <HStack spacing={{ base: 2, sm: 3 }} minW="76px">
          <Avatar
            name={assetInfo.slug}
            src={assetInfo.icon}
            boxSize={isLowerThanFourHundredAndThirty ? '18px' : '24px'}
            ignoreFallback
          />
          <Text fontSize="sm" color="grey.500">
            {assetInfo.slug}
          </Text>
        </HStack>
      )}
      {contractAssetInfo && isContract && !assetInfo && (
        <HStack spacing={{ base: 2, sm: 3 }} minW="76px">
          <Avatar
            name={contractAssetInfo.assetsInfo.slug}
            size="xs"
            src={contractAssetInfo.assetsInfo.icon}
            ignoreFallback
          />
          <Text fontSize="sm" color="grey.500">
            {contractAssetInfo.assetsInfo.slug}
          </Text>
        </HStack>
      )}

      <Box mt={0.5} minW="105px">
        <Text
          textAlign="center"
          variant={isMobile ? 'title-sm' : 'title-md'}
          color="grey.75"
          fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
        >
          {isDeposit ? null : '-'}
          {asset?.amount}
          {!asset?.amount && contractAssetInfo && contractAssetInfo.assetAmount}
        </Text>
        <Text
          textAlign="center"
          variant="description"
          fontSize="xs"
          color="grey.500"
        >
          ${txUSDAmount}
        </Text>
      </Box>

      <Center
        p={{ base: 1.5, sm: 3 }}
        borderRadius={5}
        bgColor="grey.825"
        borderWidth={1}
        borderColor="grey.925"
        boxSize="30px"
      >
        <Icon
          color="grey.250"
          fontSize={isDeploy ? '12.8px' : !isContract ? '18px' : '12.8px'}
          as={isDeploy ? DeployIcon : !isContract ? DoubleArrowIcon : FaPlay}
        />
      </Center>

      {!!asset && (
        <AddressWithCopyBtn address={asset?.to} isVaultPage={isVaultPage} />
      )}

      {isContract && contractAddress && (
        <AddressWithCopyBtn
          address={contractAddress}
          isVaultPage={isVaultPage}
        />
      )}
    </HStack>
  );
};

export { AssetBoxInfo };
