import { Box, Button, HStack } from 'bako-ui';
import { memo, ReactNode, useEffect } from 'react';

import { TransactionExpire } from '@/components';
import { Dapp } from '@/layouts/dapp';
import { useQueryParams } from '@/modules/auth/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { UseTransactionSocket } from '../../hooks';
import { SimplifiedTransaction } from '../../services/simplify-transaction';
import { DappCommon } from '..';
import { DappTransaction } from '.';
import { TransactionAlert } from './alert';

const AlertComponent = ({
  isLoading,
  pendingSignerTransactions,
}: {
  isLoading: boolean;
  pendingSignerTransactions: boolean;
}) => {
  if (isLoading) return null;

  if (pendingSignerTransactions)
    return (
      <TransactionAlert
        type="red"
        text="A new transaction cannot be created while another one is pending."
      />
    );

  return (
    <TransactionAlert
      type="yellow"
      text="Double-check transaction details before submission."
    />
  );
};

const Alert = memo(AlertComponent);

interface DappTransactionWrapperProps {
  title: string;
  primaryActionLoading: boolean;
  primaryActionButton: ReactNode;
  validAt: UseTransactionSocket['validAt'];
  vault?: UseTransactionSocket['vault'];
  pendingSignerTransactions: UseTransactionSocket['pendingSignerTransactions'];
  summary: UseTransactionSocket['summary'];
  startTime: number;
  transaction?: SimplifiedTransaction;
  cancel: () => void;
}

export const DappTransactionWrapper = (props: DappTransactionWrapperProps) => {
  const {
    title,
    startTime,
    validAt,
    primaryActionButton,
    primaryActionLoading,
    vault,
    pendingSignerTransactions,
    summary: { transactionSummary, isPending: isLoadingTransactionSummary },
    transaction,
    cancel,
  } = props;

  const isLoading = !transactionSummary || isLoadingTransactionSummary;

  const {
    workspaceInfos: {
      handlers: { goHome },
    },
  } = useWorkspaceContext();

  const { sessionId, request_id, name, origin } = useQueryParams();

  useEffect(() => {
    if (!sessionId || !request_id) {
      window.close();
      goHome();
    }
  }, [sessionId, request_id, goHome]);

  return (
    <Dapp.Container>
      <Box position="fixed" top={0} w="full" zIndex={100} left={0}>
        <TransactionExpire
          validAt={validAt}
          startTime={startTime}
          callBack={cancel}
        />
      </Box>

      <Dapp.ScrollableContent isLoading={isLoading}>
        <Dapp.Header title={title} onClose={cancel} />
        <DappTransaction.OperationPanel
          operations={transaction?.categorizedOperations}
          vault={vault!}
        />
      </Dapp.ScrollableContent>

      <Dapp.FixedFooter>
        <DappTransaction.Fee fee={transactionSummary?.fee} />
        <DappCommon.RequestingFrom name={name} origin={origin} />
        <Alert
          isLoading={isLoading}
          pendingSignerTransactions={pendingSignerTransactions}
        />
        <HStack hidden={isLoading} gap={6} w="full">
          <Button
            variant="subtle"
            color="gray.300"
            bgColor="gray.600"
            px="20px"
            fontWeight={400}
            onClick={cancel}
            disabled={primaryActionLoading}
          >
            Cancel
          </Button>
          {primaryActionButton}
        </HStack>
      </Dapp.FixedFooter>
    </Dapp.Container>
  );
};
