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

import { AddressWithCopyBtn, DoubleArrowIcon } from '@/components';
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
  const { resolveContactOrHandle } = useAddressNicknameResolver();

  const isFirstItem = index === 0;

  const gridColumnsNumber = isMobile ? 1 : 5;

  const nicknameFrom = sentBy ? resolveContactOrHandle(sentBy) : undefined;
  const nicknameTo = asset?.to ? resolveContactOrHandle(asset.to) : undefined;

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
              {nicknameFrom && (
                <Text
                  isTruncated
                  textOverflow="ellipsis"
                  maxW={{ base: '95px', xs: '95px', xl: 'full' }}
                  fontSize={isExtraSmall ? 'xs' : 'sm'}
                  textAlign="start"
                >
                  {nicknameFrom}
                </Text>
              )}
              <AddressWithCopyBtn
                address={sentBy}
                isDeposit={true}
                justifyContent="start"
                textAlign="start"
                addressProps={{
                  color: nicknameFrom ? 'grey.500' : 'white',
                }}
              />
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
              {nicknameTo && (
                <Text
                  isTruncated
                  textOverflow="ellipsis"
                  maxW="288px"
                  fontSize={isExtraSmall ? 'xs' : 'sm'}
                  textAlign="end"
                >
                  {nicknameTo}
                </Text>
              )}
              <AddressWithCopyBtn
                address={asset?.to ?? ''}
                isDeposit={true}
                addressProps={{
                  color: nicknameTo ? 'grey.500' : 'white',
                }}
              />
            </VStack>
          </Flex>
        </VStack>
      ) : (
        <>
          <TokenInfos asset={asset} />
          <AmountsInfo txUSDAmount={txUSDAmount} asset={asset} />

          <VStack alignItems="end" h={nicknameFrom ? '47px' : 'unset'}>
            {nicknameFrom && (
              <Text
                isTruncated
                textOverflow="ellipsis"
                maxW="288px"
                fontSize="sm"
                pb={0.5}
              >
                {nicknameFrom}
              </Text>
            )}
            <AddressWithCopyBtn
              address={sentBy}
              isDeposit={true}
              addressProps={{
                color: nicknameFrom ? 'grey.500' : 'white',
              }}
            />
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

          <VStack alignItems="end" h={nicknameTo ? '47px' : 'unset'}>
            {nicknameTo && (
              <Text
                isTruncated
                textOverflow="ellipsis"
                maxW="288px"
                fontSize="sm"
                pb={0.5}
              >
                {nicknameTo}
              </Text>
            )}
            <AddressWithCopyBtn
              address={asset?.to ?? ''}
              isDeposit={true}
              addressProps={{
                color: nicknameTo ? 'grey.500' : 'white',
              }}
            />
          </VStack>
        </>
      )}
    </Grid>
  );
};
export default DetailItem;
