import { Box } from 'bako-ui';
import { ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  CustomSkeleton,
  Dialog,
  LayerSwapIcon,
  TransactionExpire,
} from '@/components';
import { Dapp } from '@/layouts/dapp';
import { useQueryParams } from '@/modules/auth/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { DappTransaction } from '.';
import { UseTransactionSocket } from '../../hooks';
import { TransactionAlert } from './alert';
import { SimplifiedTransaction } from '../../services/simplify-transaction';

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

const DappTransactionWrapper = (props: DappTransactionWrapperProps) => {
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

  const {
    workspaceInfos: {
      handlers: { goHome },
    },
  } = useWorkspaceContext();

  const { sessionId, request_id, name, origin } = useQueryParams();

  if (!sessionId || !request_id) {
    window.close();
    goHome();
  }

  return (
    <Dapp.Container>
      <Box position="fixed" top={0} w="full" zIndex={100} left={0}>
        <TransactionExpire
          validAt={validAt}
          startTime={startTime}
          callBack={cancel}
        />
      </Box>

      <Dapp.Profile />

      <Dapp.ScrollableContent
        isLoading={isLoadingTransactionSummary && !transactionSummary}
      >
        <Dapp.Header
          title={title}
          onClose={cancel}
        />
        <DappTransaction.OperationPanel
          operations={transaction?.categorizedOperations}
          vault={vault!}
        />
      </Dapp.ScrollableContent>

      <Dapp.FixedFooter>
        <DappTransaction.Fee fee={transactionSummary?.fee} />

        <DappTransaction.RequestingFrom
          name={name}
          origin={origin}
        />

        {pendingSignerTransactions ?
          <TransactionAlert
            type="red"
            text="A new transaction cannot be created while another one is pending."
          />
          :
          <TransactionAlert
            type="yellow"
            text="Double-check transaction details before submission."
          />
        }

        <Dialog.Actions
          hideDivider
          hidden={isLoadingTransactionSummary || !transactionSummary}
          w="full"
        >
          {!pendingSignerTransactions ? (
            <>
              <Dialog.SecondaryAction
                size="md"
                onClick={cancel}
                disabled={primaryActionLoading}
                borderColor="grey.75"
                fontSize={14}
              >
                Cancel
              </Dialog.SecondaryAction>
              {primaryActionButton}
            </>
          ) : (
            <>
              <Dialog.SecondaryAction
                size="lg"
                width="full"
                onClick={cancel}
                fontSize={14}
                disabled={primaryActionLoading}
              >
                Back
              </Dialog.SecondaryAction>
            </>
          )}
        </Dialog.Actions>
      </Dapp.FixedFooter>
    </Dapp.Container>
  );
};

export { DappTransactionWrapper };
