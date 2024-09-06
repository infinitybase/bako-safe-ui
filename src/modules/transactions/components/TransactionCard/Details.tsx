import {
  Box,
  Button,
  Icon,
  Stack,
  useAccordionItemState,
  VStack,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import { ITransaction, TransactionStatus, TransactionType } from 'bakosafe';

import { CustomSkeleton, UpRightArrow } from '@/components';
import { shakeAnimationY, TransactionState } from '@/modules/core';

import { AssetBoxInfo } from './AssetBoxInfo';
import { DepositDetails } from './deposit-details/DepositDetails';
import DetailsTransactionStepper from './DetailsTransactionStepper';
import { TransactionStepper } from './TransactionStepper';
import { TransactionBreakdown } from './transfer-details';

export type TransactionUI = Omit<ITransaction, 'assets'> & {
  assets: {
    assetId: string;
    amount: string;
    to: string;
    recipientNickname?: string;
  }[];
  type: TransactionType;
};

interface TransactionDetailsProps {
  transaction: TransactionUI;
  status?: TransactionState;
  isInTheVaultPage?: boolean;
  isMobile?: boolean;
}

const Details = ({
  transaction,
  status,
  isInTheVaultPage,
  isMobile,
}: TransactionDetailsProps) => {
  const isDeposit = transaction.type === TransactionType.DEPOSIT;

  const handleViewInExplorer = async () => {
    const { hash } = transaction;
    window.open(
      `${import.meta.env.VITE_BLOCK_EXPLORER}/tx/0x${hash}`,
      '_BLANK',
    );
  };

  const { isOpen } = useAccordionItemState();

  if (!isMobile && !isOpen) return null;

  return (
    <DetailsTransactionStepper
      transactionId={transaction.id}
      predicateId={transaction.predicateId}
    >
      {(isLoading, transactionHistory) => (
        <CustomSkeleton py={2} isLoaded={!isLoading && !!transactionHistory}>
          {isDeposit ? (
            <DepositDetails transaction={transaction} />
          ) : (
            <VStack w="full">
              <Stack
                pt={{ base: 0, sm: 5 }}
                alignSelf="flex-start"
                display="flex"
                direction={{ base: 'column', md: 'row' }}
                alignItems="start"
                justify="space-between"
                columnGap={isInTheVaultPage ? '3rem' : '72px'}
                w="full"
              >
                {/* Transaction Breakdown */}
                <TransactionBreakdown
                  transaction={transaction}
                  status={status}
                />

                {/* Transaction History */}
                <Box
                  alignSelf="flex-start"
                  w="full"
                  minW={{ base: 200, sm: '476px' }}
                  minH="300px"
                >
                  <TransactionStepper steps={transactionHistory!} />
                </Box>
              </Stack>

              {transaction.status === TransactionStatus.SUCCESS && (
                <Button
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
            </VStack>
          )}
        </CustomSkeleton>
      )}
    </DetailsTransactionStepper>
  );
};

export { AssetBoxInfo, Details };
