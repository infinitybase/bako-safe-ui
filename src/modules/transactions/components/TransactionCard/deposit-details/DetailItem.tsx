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

import { Address, DoubleArrowIcon, Handle } from '@/components';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import AmountsInfo from './AmountsInfo';
import TokenInfos from './TokenInfos';

interface DetailItemProps {
  asset: ITransferAsset;
  index?: number;
  sentBy: string;
}

const DetailItem = ({ asset, index, sentBy }: DetailItemProps) => {
  const {
    tokensUSD,
    screenSizes: { isMobile, isExtraSmall },
  } = useWorkspaceContext();
  const txUSDAmount = useTxAmountToUSD(
    [asset],
    tokensUSD?.isLoading,
    tokensUSD?.data,
    tokensUSD?.isUnknownToken,
  );
  const { resolveAddressContactHandle } = useAddressNicknameResolver();

  const isFirstItem = index === 0;

  const gridColumnsNumber = isMobile ? 1 : 5;

  const from = sentBy ? resolveAddressContactHandle(sentBy) : undefined;
  const to = asset?.to ? resolveAddressContactHandle(asset.to) : undefined;

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
            <VStack alignItems="start" spacing={2}>
              {from?.contact && (
                <Text
                  isTruncated
                  textOverflow="ellipsis"
                  maxW={{ base: '32vw', xs: '202px', xl: 'full' }}
                  fontSize={isExtraSmall ? 'xs' : 'sm'}
                  textAlign="start"
                  textColor="grey.75"
                >
                  {from.contact}
                </Text>
              )}

              {(!from?.contact || !from.handle) && (
                <Address
                  value={sentBy}
                  isDeposit={true}
                  justifyContent="start"
                  textAlign="start"
                  color={from?.contact ? 'grey.500' : 'grey.75'}
                />
              )}

              {from?.handle && (
                <Handle
                  value={from.handle}
                  isTruncated
                  textOverflow="ellipsis"
                  maxW={{
                    base: '27vw',
                    xs: '175px',
                    lg: 'full',
                  }}
                />
              )}
            </VStack>

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

            <VStack alignItems="end" spacing={2}>
              {to?.contact && (
                <Text
                  isTruncated
                  textOverflow="ellipsis"
                  maxW={{ base: '32vw', xs: '202px', xl: 'full' }}
                  fontSize={isExtraSmall ? 'xs' : 'sm'}
                  textAlign="end"
                  textColor="grey.75"
                >
                  {to.contact}
                </Text>
              )}

              {(!to?.contact || !to.handle) && (
                <Address
                  value={asset?.to ?? ''}
                  isDeposit={true}
                  color={to?.contact ? 'grey.500' : 'grey.75'}
                />
              )}

              {to?.handle && (
                <Handle
                  value={to.handle}
                  isTruncated
                  textOverflow="ellipsis"
                  maxW={{
                    base: '27vw',
                    xs: '175px',
                    xl: 'full',
                  }}
                />
              )}
            </VStack>
          </Flex>
        </VStack>
      ) : (
        <>
          <TokenInfos asset={asset} />
          <AmountsInfo txUSDAmount={txUSDAmount} asset={asset} />

          <VStack alignItems="end" spacing={1}>
            {from?.contact && (
              <Text
                isTruncated
                textOverflow="ellipsis"
                maxW="255px"
                fontSize="sm"
                textColor="grey.75"
              >
                {from.contact}
              </Text>
            )}

            {(!from?.contact || !from.handle) && (
              <Address
                value={sentBy}
                isDeposit={true}
                color={from?.contact ? 'grey.500' : 'grey.75'}
              />
            )}

            {from?.handle && (
              <Handle
                value={from.handle}
                isTruncated
                textOverflow="ellipsis"
                maxW="230px"
              />
            )}
          </VStack>

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

          <VStack alignItems="end" spacing={1}>
            {to?.contact && (
              <Text
                isTruncated
                textOverflow="ellipsis"
                maxW="255px"
                fontSize="sm"
                textColor="grey.75"
              >
                {to.contact}
              </Text>
            )}

            {(!to?.contact || !to.handle) && (
              <Address
                value={asset?.to ?? ''}
                isDeposit={true}
                color={to?.contact ? 'grey.500' : 'grey.75'}
              />
            )}

            {to?.handle && (
              <Handle
                value={to.handle}
                isTruncated
                textOverflow="ellipsis"
                maxW="230px"
              />
            )}
          </VStack>
        </>
      )}
    </Grid>
  );
};
export default DetailItem;
