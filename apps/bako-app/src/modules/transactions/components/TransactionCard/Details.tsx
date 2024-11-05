import { ITransaction } from '@bako-safe/services/modules/transaction';
import { CustomSkeleton, UpRightArrow } from '@bako-safe/ui/components';
import { Box, Button, Icon, Stack, VStack } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { TransactionStatus, TransactionType } from 'bakosafe';

import { networkService } from '@/config/services-initializer';
import { shakeAnimationY } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { TransactionState } from '../../types';
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
  isMobileDetailsOpen?: boolean;
}

const Details = ({
  transaction,
  status,
  isInTheVaultPage,
  isMobileDetailsOpen,
}: TransactionDetailsProps) => {
  const isDeposit = transaction.type === TransactionType.DEPOSIT;
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const handleViewInExplorer = () => {
    const { hash, network } = transaction;
    window.open(
      `${networkService.getExplorer(network.url)}/tx/0x${hash}`,
      '_BLANK',
    );
  };

  return (
    <DetailsTransactionStepper
      transactionId={transaction.id}
      predicateId={transaction.predicateId}
      isMobileDetailsOpen={isMobileDetailsOpen ?? false}
      isTransactionSuccess={transaction.status === TransactionStatus.SUCCESS}
      isDeposit={isDeposit}
    >
      {(isLoading, transactionHistory) => (
        <CustomSkeleton
          py={2}
          isLoaded={isDeposit ? true : !isLoading && !!transactionHistory}
        >
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
                columnGap={{
                  base: isInTheVaultPage ? '3rem' : '72px',
                  lg: '150px',
                }}
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
                  minW={{ base: 200, sm: 'full' }}
                  mt={isMobile ? 3 : 'unset'}
                >
                  <TransactionStepper steps={transactionHistory!} />
                </Box>
              </Stack>

              {transaction.status === TransactionStatus.SUCCESS &&
                !isMobile && (
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
