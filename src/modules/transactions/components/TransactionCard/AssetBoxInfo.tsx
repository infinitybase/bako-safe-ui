import { DoubleArrowIcon } from '@/components';
import { DeployIcon } from '@/components/icons/tx-deploy';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import {
  AddressUtils,
  AssetModel,
  IGetTokenInfos,
  assetsMap,
  useGetParams,
  useScreenSize,
} from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { Icon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Center,
  HStack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { ITransferAsset } from 'bakosafe';
import { Address } from 'fuels';
import { useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';

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
  hasToken,
  isDeposit,
  isDeploy,
  isContract,
  contractAssetInfo,
  ...props
}: AssetBoxInfoProps) => {
  const { tokensUSD } = useWorkspaceContext();
  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  const isVaultPage = !!vaultId;

  const { isMobile, isExtraSmall, isExtraLarge, isLitteSmall } =
    useScreenSize();

  const assetInfo = useMemo(
    () => (asset?.assetId ? assetsMap[asset?.assetId] : null),
    [asset?.assetId],
  );

  const txUSDAmount = useTxAmountToUSD(
    [
      asset
        ? asset
        : {
            amount: contractAssetInfo?.assetAmount!,
            assetId: contractAssetInfo?.assetsInfo.assetId!,
          },
    ],
    tokensUSD?.isLoading,
    tokensUSD?.data!,
  );

  return (
    <HStack
      py={2}
      spacing={{ base: 1, xs: 14 }}
      w="full"
      borderTopWidth={1}
      {...props}
    >
      {assetInfo && (
        <HStack spacing={{ base: 2, sm: 3 }} minW="76px">
          <Avatar
            name={assetInfo.slug}
            size="xs"
            src={assetInfo.icon}
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
          fontSize="sm"
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
        <Text
          w="full"
          fontSize="sm"
          color="grey.75"
          textOverflow="ellipsis"
          isTruncated
          ml="2px"
        >
          {isLitteSmall
            ? AddressUtils.format(
                Address.fromString(asset.to ?? '').toB256(),
                isExtraSmall ? 0 : 7,
              )
            : AddressUtils.format(
                Address.fromString(asset.to ?? '').toB256(),
                !isVaultPage && isExtraLarge ? 24 : 12,
              )}
        </Text>
      )}

      {isContract && contractAddress && (
        <Text
          w="full"
          fontSize="sm"
          color="grey.75"
          textOverflow="ellipsis"
          isTruncated
          ml="2px"
        >
          {isLitteSmall
            ? AddressUtils.format(
                Address.fromString(contractAddress ?? '').toB256(),
                isExtraSmall ? 0 : 7,
              )
            : AddressUtils.format(
                Address.fromString(contractAddress ?? '').toB256(),
                !isVaultPage && isExtraLarge ? 24 : 12,
              )}
        </Text>
      )}
    </HStack>
  );
};

export { AssetBoxInfo };
