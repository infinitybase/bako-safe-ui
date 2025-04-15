import { Box, VStack } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  CustomSkeleton,
  Dialog,
  LineCloseIcon,
  TransactionExpire,
} from '@/components';
import { Dapp } from '@/layouts/dapp';
import { Container } from '@/layouts/dapp/container';
import { useQueryParams } from '@/modules/auth/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { UseTransactionSocket, useVerifyBrowserType } from '../../hooks';
import { SimplifiedTransaction } from '../../services/simplify-transaction';
import { DappError } from '../connection';
import { DappTransaction } from '.';

interface DappTransactionWrapperProps {
  title: string;
  primaryActionLoading: boolean;
  primaryActionButton: ReactNode;
  validAt: UseTransactionSocket['validAt'];
  vault?: UseTransactionSocket['vault'];
  pendingSignerTransactions: UseTransactionSocket['pendingSignerTransactions'];
  summary: UseTransactionSocket['summary'];
  startTime: number;
  transaction: SimplifiedTransaction | undefined;
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
    transaction,
    pendingSignerTransactions,
    summary: { transactionSummary, isPending: isLoadingTransactionSummary },
    cancel,
  } = props;

  const [closePopover, setClosePopover] = useState(false);

  const {
    workspaceInfos: {
      handlers: { goHome },
    },
  } = useWorkspaceContext();

  const { isSafariBrowser } = useVerifyBrowserType();
  const inView = useInView();
  const { sessionId, request_id, name, origin } = useQueryParams();

  if (!sessionId || !request_id) {
    window.close();
    goHome();
  }

  useEffect(() => {
    setClosePopover(inView.inView);
  }, [inView.inView]);
  console.log(transaction);
  console.log(transactionSummary);
  return (
    <Container>
      <Box position="fixed" top={0} w="full" zIndex={100} left={0}>
        <TransactionExpire
          validAt={validAt}
          startTime={startTime}
          callBack={cancel}
        />
      </Box>
      <Dapp.Content maxW={404} bg="dark.950">
        <Dapp.Section mb={-7}>
          <Dapp.Header
            title={title}
            description="Double-check transaction details before submission."
          />

          {isSafariBrowser && (
            <LineCloseIcon
              onClick={cancel}
              fontSize="24px"
              style={{
                position: 'absolute',
                top: 50,
                right: 20,
                cursor: 'pointer',
              }}
            />
          )}
        </Dapp.Section>

        <CustomSkeleton
          isLoaded={!isLoadingTransactionSummary && !!transactionSummary}
        >
          {/* Essa box é usada como "parâmetro" para fechar o popover do max fee. */}
          <Box ref={inView?.ref} />
          {pendingSignerTransactions && (
            <Dapp.Section maxW={356}>
              <DappError />
            </Dapp.Section>
          )}
          <VStack spacing={1} mb={-4} w="full">
            {(isLoadingTransactionSummary || !transactionSummary) && (
              <DappTransaction.OperationSkeleton />
            )}
            {transaction?.categorizedOperations.mainOperations?.map(
              (operation, index) => (
                <DappTransaction.Operation
                  key={`${index}operation`}
                  vault={{
                    name: vault?.name || '',
                    predicateAddress: vault?.address || '',
                  }}
                  operation={operation}
                />
              ),
            )}
            {transaction?.categorizedOperations.intermediateContractCalls?.map(
              (operation, index) => (
                <DappTransaction.Operation
                  key={`${index}operation`}
                  vault={{
                    name: vault?.name || '',
                    predicateAddress: vault?.address || '',
                  }}
                  operation={operation}
                />
              ),
            )}
            {transaction?.categorizedOperations.notRelatedToCurrentAccount?.map(
              (operation, index) => (
                <DappTransaction.Operation
                  key={`${index}operation`}
                  vault={{
                    name: vault?.name || '',
                    predicateAddress: vault?.address || '',
                  }}
                  operation={operation}
                />
              ),
            )}
          </VStack>

          <Dapp.Section>
            <DappTransaction.RequestingFrom
              mb={7}
              name={name}
              origin={origin}
            />
          </Dapp.Section>
          <DappTransaction.Fee
            closePopover={closePopover}
            fee={transactionSummary?.fee}
          />
          {/* Actions */}

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
                  isDisabled={primaryActionLoading}
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
                  isDisabled={primaryActionLoading}
                >
                  Back
                </Dialog.SecondaryAction>
              </>
            )}
          </Dialog.Actions>
        </CustomSkeleton>
      </Dapp.Content>
    </Container>
  );
};

export { DappTransactionWrapper };
