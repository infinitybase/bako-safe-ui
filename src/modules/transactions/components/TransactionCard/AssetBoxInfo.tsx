import { Icon } from '@chakra-ui/icons';
import { Box, Center, HStack, StackProps, Text } from '@chakra-ui/react';
import { Address } from 'fuels';
import { useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';

import { DoubleArrowIcon, UnknownIcon } from '@/components';
import { DeployIcon } from '@/components/icons/tx-deploy';
import { useGetContactByAddress } from '@/modules/addressBook';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import {
  AddressUtils,
  AssetModel,
  assetsMap,
  useGetParams,
} from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface AssetBoxInfoProps extends StackProps {
  asset?: AssetModel;
  hasToken?: boolean;
  isDeposit?: boolean;
  isDeploy?: boolean;
  isContract?: boolean;
}

const AssetBoxInfo = ({
  asset,
  isDeposit,
  isDeploy,
  isContract,
  ...props
}: AssetBoxInfoProps) => {
  const {
    tokensUSD,
    screenSizes: { isMobile, isExtraSmall, isExtraLarge, isLitteSmall },
    addressBookInfos: {
      requests: {
        listContactsRequest: { data },
      },
    },
  } = useWorkspaceContext();

  const { savedContact } = useGetContactByAddress(asset?.to ?? '', data);

  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  const isVaultPage = !!vaultId;

  const assetInfo = useMemo(
    () =>
      asset?.assetId && assetsMap[asset?.assetId]
        ? assetsMap[asset?.assetId]
        : assetsMap['UNKNOWN'],
    [asset?.assetId],
  );

  const txUSDAmount = useTxAmountToUSD(
    [
      asset
        ? asset
        : {
            amount: '',
            assetId: '',
          },
    ],
    tokensUSD?.isLoading,
    tokensUSD?.data,
  );

  return (
    <HStack
      py={2}
      spacing={{ base: 1, xs: 10 }}
      w="full"
      borderTopWidth={1}
      {...props}
    >
      {assetInfo && (
        <HStack spacing={{ base: 2, sm: 3 }} minW="76px">
          <Icon w={6} h={6} as={assetInfo?.icon ?? UnknownIcon} />
          <Text fontSize="sm" color="grey.500">
            {assetInfo.slug}
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
          textAlign="end"
        >
          {savedContact?.nickname ? (
            <Text
              isTruncated
              textOverflow="ellipsis"
              maxW={{ base: '150px', xs: '95px', xl: 'full' }}
              textAlign="end"
            >
              {savedContact.nickname}
            </Text>
          ) : isLitteSmall ? (
            AddressUtils.format(
              Address.fromString(asset.to ?? '').toB256(),
              isExtraSmall ? 0 : 7,
            )
          ) : (
            AddressUtils.format(
              Address.fromString(asset.to ?? '').toB256(),
              !isVaultPage && isExtraLarge ? 10 : 12,
            )
          )}
        </Text>
      )}
    </HStack>
  );
};

export { AssetBoxInfo };
