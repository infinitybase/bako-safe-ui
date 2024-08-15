import { DoubleArrowIcon } from '@/components';
import { DeployIcon } from '@/components/icons/tx-deploy';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import {
  AddressUtils,
  AssetModel,
  assetsMap,
  useScreenSize,
} from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { limitCharacters } from '@/utils';
import { Icon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Center,
  HStack,
  StackProps,
  Text,
  VStack,
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
}

const AssetBoxInfo = ({
  asset,
  contractAddress,
  hasToken,
  isDeposit,
  isDeploy,
  ...props
}: AssetBoxInfoProps) => {
  const { tokensUSD } = useWorkspaceContext();

  const isContract = !!contractAddress;
  const { isMobile, isExtraSmall } = useScreenSize();

  const assetInfo = useMemo(
    () => (asset?.assetId ? assetsMap[asset?.assetId] : null),
    [asset?.assetId],
  );

  const txUSDAmount = useTxAmountToUSD(
    [asset as ITransferAsset],
    tokensUSD?.isLoading,
    tokensUSD?.data!,
  );

  const contractWithoutToken = isContract && !hasToken;

  return (
    <HStack
      py={2}
      spacing={{ base: 1, sm: 14 }}
      w="full"
      borderTopWidth={1}
      {...props}
    >
      {contractWithoutToken ? (
        <Text
          fontWeight="semibold"
          color="grey.425"
          w={{ base: 'full', sm: 'unset' }}
        >
          Contract execution
        </Text>
      ) : (
        <>
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
        </>
      )}

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

      {isContract && (
        <VStack spacing={0} alignItems="flex-end">
          <HStack spacing={3}>
            <Text
              maxW="228px"
              w="full"
              fontSize="sm"
              color="grey.75"
              textOverflow="ellipsis"
              isTruncated
              ml="2px"
            >
              {isExtraSmall
                ? limitCharacters(
                    AddressUtils.format(
                      Address.fromString(asset?.to ?? '').toB256(),
                    ) ?? '',
                    7,
                  )
                : AddressUtils.format(
                    Address.fromString(asset?.to ?? '').toB256(),
                    isMobile ? 10 : 24,
                  )}
            </Text>
          </HStack>
        </VStack>
      )}

      {!isContract && !!asset && (
        <VStack
          h="full"
          w="full"
          minH={51}
          maxW={200}
          spacing={0}
          justifyContent="center"
          alignItems={{ base: 'center', sm: 'start' }}
        >
          <Text
            maxW="228px"
            w="full"
            fontSize="sm"
            color="grey.75"
            textOverflow="ellipsis"
            isTruncated
            ml="2px"
          >
            {isExtraSmall
              ? limitCharacters(
                  AddressUtils.format(
                    Address.fromString(asset.to ?? '').toB256(),
                  ) ?? '',
                  7,
                )
              : AddressUtils.format(
                  Address.fromString(asset.to ?? '').toB256(),
                  isMobile ? 10 : 24,
                )}
          </Text>
        </VStack>
      )}
    </HStack>
  );
};

export { AssetBoxInfo };
