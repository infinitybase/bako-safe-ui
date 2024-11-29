import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import { type ITransferAsset, TransactionStatus } from 'bakosafe';

import { SuccessIcon, UpRightArrow } from '@/components';
import { shakeAnimationY } from '@/modules/core';
import { NetworkService } from '@/modules/network/services';
import {
  useGetAssetsByOperations,
  useVerifyTransactionInformations,
} from '@/modules/transactions/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import type { TransactionWithVault } from '../../../services';
import DetailItem from './DetailItem';

type DepositDetailsProps = {
  transaction: TransactionWithVault;
};

const DepositDetails = ({ transaction }: DepositDetailsProps) => {
  const { operationAssets, sentBy, hasNoDefaultAssets } =
    useGetAssetsByOperations(transaction);

  const predicate = transaction.predicate?.predicateAddress;

  if (!transaction.summary || !predicate) {
    return null;
  }

  const assets: ITransferAsset[] =
    transaction.summary.operations
      ?.find((o) => o.to?.address === predicate)
      ?.assetsSent?.map((asset) => ({
        assetId: asset.assetId,
        amount: asset.amount.toString(),
        to: predicate,
      })) ?? [];

  const {
    screenSizes: { isMobile, isLowerThanFourHundredAndThirty },
  } = useWorkspaceContext();

  const { isFuelFriday } = useVerifyTransactionInformations(transaction);

  const handleViewInExplorer = () => {
    const { hash, network } = transaction;
    window.open(
      `${NetworkService.getExplorer(network.url)}/tx/0x${hash}`,
      '_BLANK',
    );
  };

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'row', xs: 'column' }}
      w="full"
      minW={{ base: 200, sm: '476px' }}
      flexWrap="wrap"
      minH={{ base: 560, xs: 400, sm: 'unset' }}
    >
      <VStack w="full" mt={isMobile ? 'unset' : 5}>
        {isMobile && <Divider my={5} borderColor="grey.425" />}

        {isFuelFriday && (
          <Box w="full">
            <HStack
              maxW="500px"
              bg="linear-gradient(0deg, rgba(73, 248, 174, 0.15), rgba(73, 248, 174, 0.15)), rgba(21, 20, 19, 0.75)"
              borderColor="rgba(73, 248, 174, 0.3)"
              borderWidth="1px"
              borderRadius={10}
              justify={'center'}
              alignItems="flex-start"
              mb={4}
              py={4}
              px={4}
            >
              <Icon as={SuccessIcon} color="#00E65C" mt={1} fontSize={27} />

              <VStack spacing={0} alignItems="flex-start">
                <Text fontWeight="bold" color="#00E65C" fontSize="sm">
                  Fuel the Future of Scalable Payments
                </Text>
                <Text color="#80F9C5" fontSize="xs">
                  This transaction demonstrates the efficiency of $USDF
                  micropayments on the Fuel Network, highlighting everyday
                  utility and how Bako Safe and Bako ID simplify fund transfers.
                </Text>
              </VStack>
            </HStack>
          </Box>
        )}

        <Box pb={6} borderColor="grey.950" borderBottomWidth={1} w="full">
          <Text
            color="grey.425"
            fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
          >
            Transaction breakdown
          </Text>
        </Box>

        <Box alignItems="flex-start" flexWrap="wrap" w="full">
          {assets.map((asset, index) => (
            <DetailItem
              key={`${asset?.assetId}${index}-key`}
              asset={asset}
              index={index}
              sentBy={sentBy}
            />
          ))}
        </Box>
      </VStack>

      {!isMobile && transaction.status === TransactionStatus.SUCCESS && (
        <Button
          w={isMobile ? 'full' : 'unset'}
          mt={isMobile ? 'auto' : '32px'}
          border="none"
          bgColor="#F5F5F50D"
          fontSize="xs"
          fontWeight="normal"
          letterSpacing=".5px"
          alignSelf={{ base: 'stretch', sm: 'flex-end' }}
          variant="secondary"
          onClick={handleViewInExplorer}
          css={css`
            &:hover .btn-icon {
              animation: ${shakeAnimationY} 0.5s ease-in-out;
            }
          `}
          rightIcon={
            <Icon as={UpRightArrow} fontSize="lg" className="btn-icon" />
          }
        >
          View on Explorer
        </Button>
      )}
    </Box>
  );
};
export { DepositDetails };
