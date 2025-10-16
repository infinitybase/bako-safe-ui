import { Box, Button, Flex, HStack, Stack, Text, VStack } from 'bako-ui';
import { TransactionStatus, TransactionType } from 'bakosafe';
import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { enUS } from 'date-fns/locale';
import { memo, useCallback, useMemo, useState } from 'react';

import { CustomSkeleton, FileCodeIcon, UpRightArrow } from '@/components';
import { TrashIcon } from '@/components/icons/trash';
import env from '@/config/env';
import { type TransactionState } from '@/modules/core';
import type { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';
import { NetworkService } from '@/modules/network/services';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import {
  ON_OFF_RAMP_TRANSACTION_TYPES,
  TransactionTypeWithRamp,
} from '../../services';
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
  type: TransactionType | TransactionTypeWithRamp;
};

interface CancelTransactionButtonProps {
  transaction: TransactionUI;
}

const CancelTransactionButton = ({
  transaction,
}: CancelTransactionButtonProps) => {
  const {
    signTransaction: { isLoading: isSigningTransaction },
    cancelTransaction: {
      isPending: isCancelingTransaction,
      mutate: cancelTransaction,
    },
  } = useTransactionsContext();

  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const isCancelable = useMemo(
    () => transaction.status === TransactionStatus.AWAIT_REQUIREMENTS,
    [transaction.status],
  );

  if (!isCancelable) return null;

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsClicked(true);
    setIsLocalLoading(true);

    cancelTransaction(transaction.hash, {
      onSettled: () => {
        setIsLocalLoading(false);
      },
    });
  };

  return (
    <Button
      h={9}
      px={3}
      // variant="error"
      colorPalette="red"
      size={{ base: 'sm', sm: 'xs', lg: 'sm' }}
      fontSize={{ base: 'unset', sm: 14, lg: 'unset' }}
      loading={isLocalLoading}
      disabled={isSigningTransaction || (!isClicked && isCancelingTransaction)}
      onClick={handleCancel}
    >
      <TrashIcon />
      Cancel transaction
    </Button>
  );
};

interface TransactionDetailsProps {
  transaction: TransactionUI;
  status?: TransactionState;
  isInTheVaultPage?: boolean;
  isMobile?: boolean;
  isMobileDetailsOpen?: boolean;
}

const Details = memo(
  ({
    transaction,
    status,
    isInTheVaultPage,
    isMobileDetailsOpen,
  }: TransactionDetailsProps) => {
    const isDeposit = useMemo(
      () => transaction.type === TransactionType.DEPOSIT,
      [transaction.type],
    );
    const isOnOffRamp = useMemo(
      () => ON_OFF_RAMP_TRANSACTION_TYPES.includes(transaction.type),
      [transaction.type],
    );

    const {
      screenSizes: { isMobile },
    } = useWorkspaceContext();

    const handleViewInExplorer = useCallback(() => {
      const { hash, network } = transaction;
      window.open(
        `${NetworkService.getExplorer(network.url)}/tx/0x${hash}`,
        '_BLANK',
      );
    }, [transaction]);

    return (
      <DetailsTransactionStepper
        transactionId={transaction.id}
        predicateId={transaction.predicateId}
        isMobileDetailsOpen={isMobileDetailsOpen ?? false}
        isTransactionSuccess={transaction.status === TransactionStatus.SUCCESS}
        isDeposit={isDeposit}
      >
        {(isLoading, transactionHistory) => (
          <CustomSkeleton py={2} loading={isLoading && !transactionHistory}>
            <>
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
                    {!isOnOffRamp && (
                      <Box
                        alignSelf="flex-start"
                        w="full"
                        minW={{ base: 200, sm: 'full' }}
                        mt={isMobile ? 3 : 'unset'}
                      >
                        <TransactionStepper steps={transactionHistory ?? []} />
                      </Box>
                    )}
                  </Stack>

                  <Flex justify="space-between" width="100%" align="center">
                    {/* LADO ESQUERDO */}
                    {!isMobile && !isDeposit && (
                      <Box>
                        <Text
                          // variant="description"
                          color="grey.425"
                          fontSize="xs"
                        >
                          {formatInTimeZone(
                            parseISO(transaction.createdAt),
                            Intl.DateTimeFormat().resolvedOptions().timeZone,
                            'EEE, do MMM, hh:mm a',
                            { locale: enUS },
                          )}
                        </Text>
                      </Box>
                    )}

                    {/* LADO DIREITO */}
                    <HStack gap={2}>
                      {!isMobile && !isDeposit && (
                        <a
                          href={`${env.BASE_API_URL}/transaction/${transaction.id}/advanced-details`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            // variant="secondaryV2"
                            alignSelf="flex-end"
                            size={{ base: 'sm', sm: 'xs', lg: 'sm' }}
                          >
                            <FileCodeIcon fontSize="lg" />
                            Advanced details
                          </Button>
                        </a>
                      )}

                      {!isMobile &&
                        transaction.status === TransactionStatus.SUCCESS && (
                          <Button
                            // variant="secondaryV2"
                            onClick={handleViewInExplorer}
                            size={{ base: 'sm', sm: 'xs', lg: 'sm' }}
                          >
                            <UpRightArrow color="grey.75" fontSize="md" />
                            View on Explorer
                          </Button>
                        )}

                      <CancelTransactionButton transaction={transaction} />
                    </HStack>
                  </Flex>
                </VStack>
              )}
            </>
          </CustomSkeleton>
        )}
      </DetailsTransactionStepper>
    );
  },
);

Details.displayName = 'Transaction Details';

export { AssetBoxInfo, Details };
