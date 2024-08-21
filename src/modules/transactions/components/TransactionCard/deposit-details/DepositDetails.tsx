import { Box, Button, Icon, Text, VStack } from '@chakra-ui/react';

import DetailItem from './DetailItem';
import { css } from '@emotion/react';
import { TransactionStatus } from 'bakosafe';
import { shakeAnimationY } from '@/modules/core';
import { TransactionWithVault } from '../../../services';
import { UpRightArrow } from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

type DepositDetailsProps = {
  transaction: TransactionWithVault;
};

const DepositDetails = ({ transaction }: DepositDetailsProps) => {
  const sentBy = transaction.txData.inputs[0]['owner'];

  const handleViewInExplorer = async () => {
    const { hash } = transaction;
    window.open(
      `${import.meta.env.VITE_BLOCK_EXPLORER}/tx/0x${hash}`,
      '_BLANK',
    );
  };

  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'row', xs: 'column' }}
      w="full"
      minW={{ base: 200, sm: '476px' }}
      flexWrap="wrap"
      minH={{ base: 560, xs: 400, sm: 'unset' }}
    >
      <VStack w="full">
        <Box pb={3} borderColor="grey.950" borderBottomWidth={1} w="full">
          <Text color="grey.425" fontSize="sm">
            Transaction breakdown
          </Text>
        </Box>

        <Box alignItems="flex-start" flexWrap="wrap" w="full">
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

      {transaction.status === TransactionStatus.SUCCESS && (
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
