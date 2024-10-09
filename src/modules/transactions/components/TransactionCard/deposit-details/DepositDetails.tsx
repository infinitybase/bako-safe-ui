import { Box, Button, Divider, Icon, Text, VStack } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { TransactionStatus } from 'bakosafe';

import { UpRightArrow } from '@/components';
import { shakeAnimationY } from '@/modules/core';
import { NetworkService } from '@/modules/network/services';
import { useGetAssetsByOperations } from '@/modules/transactions/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { TransactionWithVault } from '../../../services';
import DetailItem from './DetailItem';

type DepositDetailsProps = {
  transaction: TransactionWithVault;
};

const DepositDetails = ({ transaction }: DepositDetailsProps) => {
  const { operationAssets, sentBy, hasNoDefaultAssets } =
    useGetAssetsByOperations(transaction);

  const {
    screenSizes: { isMobile, isLowerThanFourHundredAndThirty },
  } = useWorkspaceContext();

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

        <Box pb={6} borderColor="grey.950" borderBottomWidth={1} w="full">
          <Text
            color="grey.425"
            fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
          >
            Transaction breakdown
          </Text>
        </Box>

        <Box alignItems="flex-start" flexWrap="wrap" w="full">
          {hasNoDefaultAssets && operationAssets && (
            <DetailItem asset={operationAssets} sentBy={sentBy} />
          )}
          {transaction.assets.map((asset, index) => (
            <DetailItem
              key={index}
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
