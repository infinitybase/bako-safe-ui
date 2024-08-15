import { Box, Button, Icon, Text, VStack } from '@chakra-ui/react';
import { css, keyframes } from '@emotion/react';
import { TransactionStatus } from 'bakosafe';

import { UpRightArrow } from '@/components';
import { useScreenSize } from '@/modules/core';

import { TransactionWithVault } from '../../services';
import DetailItem from './deposit-details/DetailItem';

type DepositDetailsProps = {
  transaction: TransactionWithVault;
};

const shakeAnimation = keyframes`
  0% { transform: translateY(0); }
  25% { transform: translateY(-2px); }
  50% { transform: translateY(2px); }
  75% { transform: translateY(-2px); }
  100% { transform: translateY(0); }
`;

const DepositDetails = ({ transaction }: DepositDetailsProps) => {
  const toAddress = transaction.predicate?.predicateAddress;

  const handleViewInExplorer = async () => {
    const { hash } = transaction;
    window.open(
      `${import.meta.env.VITE_BLOCK_EXPLORER}/tx/0x${hash}`,
      '_BLANK',
    );
  };

  const { isMobile } = useScreenSize();

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
              toAddress={toAddress ?? ''}
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
              animation: ${shakeAnimation} 0.5s ease-in-out;
            }
          `}
          rightIcon={
            <Icon
              as={UpRightArrow}
              textColor="grey.75"
              fontSize="lg"
              className="btn-icon"
            />
          }
        >
          View on Explorer
        </Button>
      )}
    </Box>
  );
};
export { DepositDetails };
