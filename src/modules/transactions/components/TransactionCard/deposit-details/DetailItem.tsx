import {
  Box,
  Center,
  Flex,
  Grid,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ITransferAsset } from 'bakosafe';
import { Address } from 'fuels';

import { DoubleArrowIcon } from '@/components';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { AddressUtils, useScreenSize } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import AmountsInfo from './AmountsInfo';
import TokenInfos from './TokenInfos';

interface DetailItemProps {
  asset: ITransferAsset;
  index: number;
  sentBy: string;
}

const DetailItem = ({ asset, index, sentBy }: DetailItemProps) => {
  const { tokensUSD } = useWorkspaceContext();
  const txUSDAmount = useTxAmountToUSD(
    [asset],
    tokensUSD?.isLoading,
    tokensUSD?.data!,
  );

  const { isExtraSmall, isMobile, isSmall } = useScreenSize();

  const isFirstItem = index === 0;

  const gridColumnsNumber = isMobile ? 1 : 5;

  return (
    <Grid
      gridTemplateColumns={`repeat(${gridColumnsNumber}, 1fr)`}
      alignItems="center"
      w="full"
      borderColor="grey.950"
      borderBottomWidth={1}
      pt={isFirstItem ? '1px' : '9px'}
      pb={2}
    >
      {isMobile ? (
        <VStack w="full" spacing="7px">
          <HStack w="100%" justifyContent="space-between" pr="2px">
            <TokenInfos asset={asset} />
            <AmountsInfo txUSDAmount={txUSDAmount} asset={asset} />
          </HStack>
          <Flex justifyContent="space-between" w="full" alignItems="center">
            <Text
              maxW="288px"
              w="full"
              fontSize="sm"
              color="grey.75"
              textOverflow="ellipsis"
              isTruncated
            >
              {AddressUtils.format(
                Address.fromString(sentBy ?? '').toB256(),
                isExtraSmall ? 4 : isSmall ? 8 : isMobile ? 16 : 24,
              )}
            </Text>

            <Box display="flex" justifyContent="center" w="full">
              <Center
                borderRadius={5}
                bgColor="grey.825"
                borderWidth={1}
                borderColor="grey.925"
                boxSize="30px"
              >
                <Icon color="grey.250" fontSize="18px" as={DoubleArrowIcon} />
              </Center>
            </Box>

            <Text
              maxW="288px"
              w="full"
              fontSize="sm"
              color="grey.75"
              textOverflow="ellipsis"
              isTruncated
              textAlign="end"
            >
              {AddressUtils.format(
                Address.fromString(asset?.to ?? '').toB256(),
                isExtraSmall ? 4 : isSmall ? 8 : isMobile ? 16 : 24,
              )}
            </Text>
          </Flex>
        </VStack>
      ) : (
        <>
          <TokenInfos asset={asset} />
          <AmountsInfo txUSDAmount={txUSDAmount} asset={asset} />
          <Text
            maxW="288px"
            w="full"
            fontSize="sm"
            color="grey.75"
            textOverflow="ellipsis"
            isTruncated
          >
            {AddressUtils.format(
              Address.fromString(sentBy ?? '').toB256(),
              isMobile ? 10 : 14,
            )}
          </Text>

          <Box display="flex" justifyContent="center" w="full">
            <Center
              borderRadius={5}
              bgColor="grey.825"
              borderWidth={1}
              borderColor="grey.925"
              boxSize="30px"
            >
              <Icon color="grey.250" fontSize="18px" as={DoubleArrowIcon} />
            </Center>
          </Box>

          <Text
            maxW="288px"
            w="full"
            fontSize="sm"
            color="grey.75"
            textOverflow="ellipsis"
            isTruncated
          >
            {AddressUtils.format(
              Address.fromString(asset.to ?? '').toB256(),
              isMobile ? 10 : 14,
            )}
          </Text>
        </>
      )}
    </Grid>
  );
};
export default DetailItem;
