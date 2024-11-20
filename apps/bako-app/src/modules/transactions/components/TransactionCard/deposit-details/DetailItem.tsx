import { DoubleArrowIcon } from '@bako-safe/ui/components';
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

import { AddressWithCopyBtn } from '@/modules';
import { useGetContactByAddress } from '@/modules/addressBook';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
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
    addressBookInfos: {
      requests: {
        listContactsRequest: { data },
      },
    },
  } = useWorkspaceContext();
  const txUSDAmount = useTxAmountToUSD(
    [asset],
    tokensUSD?.isLoading,
    tokensUSD?.data,
    tokensUSD?.isUnknownToken,
  );

  const isFirstItem = index === 0;

  const gridColumnsNumber = isMobile ? 1 : 5;

  const { savedContact: savedContactFrom } = useGetContactByAddress(
    sentBy ?? '',
    data,
  );
  const { savedContact: savedContactTo } = useGetContactByAddress(
    asset?.to ?? '',
    data,
  );

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
              {savedContactFrom?.nickname && (
                <Text
                  isTruncated
                  textOverflow="ellipsis"
                  maxW={{ base: '95px', xs: '95px', xl: 'full' }}
                  fontSize={isExtraSmall ? 'xs' : 'sm'}
                  textAlign="start"
                >
                  {savedContactFrom.nickname}
                </Text>
              )}
              <AddressWithCopyBtn
                address={sentBy}
                isDeposit={true}
                justifyContent="start"
                textAlign="start"
                addressProps={{
                  color: savedContactFrom?.nickname ? 'grey.500' : 'white',
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
              {savedContactTo?.nickname && (
                <Text
                  isTruncated
                  textOverflow="ellipsis"
                  maxW="288px"
                  fontSize={isExtraSmall ? 'xs' : 'sm'}
                  textAlign="end"
                >
                  {savedContactTo.nickname}
                </Text>
              )}
              <AddressWithCopyBtn
                address={asset?.to ?? ''}
                isDeposit={true}
                addressProps={{
                  color: savedContactTo?.nickname ? 'grey.500' : 'white',
                }}
              />
            </VStack>
          </Flex>
        </VStack>
      ) : (
        <>
          <TokenInfos asset={asset} />
          <AmountsInfo txUSDAmount={txUSDAmount} asset={asset} />

          <VStack
            alignItems="end"
            h={savedContactFrom?.nickname ? '47px' : 'unset'}
          >
            {savedContactFrom?.nickname && (
              <Text
                isTruncated
                textOverflow="ellipsis"
                maxW="288px"
                fontSize="sm"
              >
                {savedContactFrom.nickname}
              </Text>
            )}
            <AddressWithCopyBtn
              address={sentBy}
              isDeposit={true}
              addressProps={{
                color: savedContactFrom?.nickname ? 'grey.500' : 'white',
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

          <VStack
            alignItems="end"
            h={savedContactTo?.nickname ? '47px' : 'unset'}
          >
            {savedContactTo?.nickname && (
              <Text
                isTruncated
                textOverflow="ellipsis"
                maxW="288px"
                fontSize="sm"
              >
                {savedContactTo.nickname}
              </Text>
            )}
            <AddressWithCopyBtn
              address={asset?.to ?? ''}
              isDeposit={true}
              addressProps={{
                color: savedContactTo?.nickname ? 'grey.500' : 'white',
              }}
            />
          </VStack>
        </>
      )}
    </Grid>
  );
};
export default DetailItem;
