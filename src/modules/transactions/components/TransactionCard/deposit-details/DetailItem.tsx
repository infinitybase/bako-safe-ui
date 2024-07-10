import { AddressUtils, useScreenSize } from '@/modules/core';
import TokenInfos from './TokenInfos';
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
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { ITransferAsset } from 'bakosafe';
import AmountsInfo from './AmountsInfo';
import { limitCharacters } from '@/utils';
import { Address } from 'fuels';
import { DoubleArrowIcon } from '@/components';

interface DetailItemProps {
  asset: ITransferAsset;
  index: number;
  toAddress: string;
}

const DetailItem = ({ asset, index, toAddress }: DetailItemProps) => {
  const txUSDAmount = useTxAmountToUSD([asset]);

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
              {isExtraSmall
                ? limitCharacters(
                    AddressUtils.format(
                      Address.fromString(asset.to ?? '').toAddress(),
                    ) ?? '',
                    isMobile ? 16 : 24,
                  )
                : AddressUtils.format(
                    Address.fromString(asset.to ?? '').toAddress(),
                    isSmall ? 8 : isMobile ? 16 : 24,
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
              {isExtraSmall
                ? limitCharacters(
                    AddressUtils.format(
                      Address.fromString(toAddress ?? '').toAddress(),
                    ) ?? '',
                    isMobile ? 16 : 24,
                  )
                : AddressUtils.format(
                    Address.fromString(toAddress ?? '').toAddress(),
                    isSmall ? 8 : isMobile ? 16 : 24,
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
            {isExtraSmall
              ? limitCharacters(
                  AddressUtils.format(
                    Address.fromB256(asset.to ?? '').toAddress(),
                  ) ?? '',
                  7,
                )
              : AddressUtils.format(
                  Address.fromString(asset.to ?? '').toAddress(),
                  isMobile ? 10 : 24,
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
            {isExtraSmall
              ? limitCharacters(
                  AddressUtils.format(
                    Address.fromString(toAddress ?? '').toAddress(),
                  ) ?? '',
                  7,
                )
              : AddressUtils.format(
                  Address.fromString(toAddress ?? '').toAddress(),
                  isMobile ? 10 : 24,
                )}
          </Text>
        </>
      )}
    </Grid>
  );
};
export default DetailItem;
