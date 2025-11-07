import { Box, Button, HStack, Icon, Text, VStack } from 'bako-ui';
import { type ITransferAsset, TransactionStatus } from 'bakosafe';
import { useMemo } from 'react';

import { SuccessIcon, UpRightArrow } from '@/components';
import { NetworkService } from '@/modules/network/services';
import {
  useGetAssetsByOperations,
  useVerifyTransactionInformations,
} from '@/modules/transactions/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import type { TransactionWithVault } from '../../../services';
import DetailItem from './DetailItem';

type DepositDetailsProps = {
  transaction: TransactionWithVault;
};

const DepositDetails = ({ transaction }: DepositDetailsProps) => {
  const { sentBy } = useGetAssetsByOperations(transaction);
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const { isFuelFriday } = useVerifyTransactionInformations(transaction);

  const predicate = transaction.predicate?.predicateAddress;

  const assets: ITransferAsset[] = useMemo(
    () =>
      transaction.summary?.operations
        ?.find((o) => o.to?.address === predicate)
        ?.assetsSent?.map((asset) => ({
          assetId: asset.assetId,
          amount: asset.amount.toString(),
          to: predicate!,
        })) ?? [],
    [transaction?.summary, predicate],
  );

  if (!transaction.summary || !predicate) {
    return null;
  }

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
      flexDirection={{ base: 'row', md: 'column' }}
      w="full"
      minW={{ base: 200, sm: '476px' }}
      flexWrap="wrap"
      minH={{ base: 560, md: 400, sm: 'unset' }}
    >
      <VStack w="full" mt={isMobile ? 'unset' : 5}>
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
              <Icon as={SuccessIcon} color="#00E65C" mt={1} w="27px" />

              <VStack gap={0} alignItems="flex-start">
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

        <Box pb={6} w="full">
          <Text color="gray.400" fontSize="xs">
            Transaction breakdown
          </Text>
        </Box>

        <Box alignItems="flex-start" flexWrap="wrap" w="full" gap={1}>
          {assets.map((asset, index) => (
            <DetailItem
              key={`${asset?.assetId}${index}-key`}
              asset={asset}
              sentBy={sentBy}
            />
          ))}
        </Box>
      </VStack>

      {!isMobile && (
        <HStack
          w="100%"
          justifyContent="end"
          alignItems="center"
          mt={4}
          flex={1}
        >
          {transaction.status === TransactionStatus.SUCCESS && (
            <Button
              w={isMobile ? 'full' : 'unset'}
              alignSelf={{ base: 'stretch', sm: 'flex-end' }}
              size={{ base: 'sm', sm: 'xs', lg: 'sm' }}
              variant="subtle"
              onClick={handleViewInExplorer}
            >
              <UpRightArrow w={3} color="gray.200" />
              Explorer
            </Button>
          )}
        </HStack>
      )}
    </Box>
  );
};
export { DepositDetails };
