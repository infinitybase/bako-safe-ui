import { Box, Flex, Spinner, useDisclosure, VStack } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Dialog, LineCloseIcon, TransactionExpire } from '@/components';
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

  const showLoading = isLoadingTransactionSummary || !transactionSummary;

  const { isOpen: mainOpen, onToggle: toggleMain } = useDisclosure({
    defaultIsOpen: true,
  });
  const { isOpen: intermediateOpen, onToggle: toggleIntermediate } =
    useDisclosure();
  const { isOpen: unrelatedOpen, onToggle: toggleUnrelated } = useDisclosure();

  return (
    <Container>
      {/* Barra de expiração fixa */}
      <Box position="fixed" top={0} w="full" zIndex={100} left={0}>
        <TransactionExpire
          validAt={validAt}
          startTime={startTime}
          callBack={cancel}
        />
      </Box>

      {/* Overlay de loading com transição suave */}
      <Flex
        position="fixed"
        top={0}
        left={0}
        w="full"
        h="full"
        justify="center"
        align="center"
        zIndex={500}
        bg="dark.950"
        transition="opacity 0.5s ease"
        opacity={showLoading ? 1 : 0}
        pointerEvents={showLoading ? 'auto' : 'none'}
      >
        <Spinner size="lg" color="primary.500" />
      </Flex>

      <Dapp.Content maxW={404} bg="dark.950" pb="250px">
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

        <Box ref={inView?.ref} />

        {pendingSignerTransactions && (
          <Dapp.Section maxW={356}>
            <DappError />
          </Dapp.Section>
        )}

        <VStack spacing={2} gap={2} w="full">
          <DappTransaction.OperationSection
            operations={transaction?.categorizedOperations.mainOperations || []}
            isOpen={mainOpen}
            onToggle={toggleMain}
            vault={vault!}
            sectionKey="main"
          />
          <DappTransaction.OperationSection
            title="Intermediate contract calls"
            operations={
              transaction?.categorizedOperations.intermediateContractCalls || []
            }
            isOpen={intermediateOpen}
            onToggle={toggleIntermediate}
            vault={vault!}
            sectionKey="intermediate"
          />
          <DappTransaction.OperationSection
            title="Operations not related to your vault"
            operations={
              transaction?.categorizedOperations.notRelatedToCurrentAccount ||
              []
            }
            isOpen={unrelatedOpen}
            onToggle={toggleUnrelated}
            vault={vault!}
            sectionKey="unrelated"
          />
        </VStack>
      </Dapp.Content>

      {/* Footer fixo centralizado */}
      <Box
        position="fixed"
        bottom={0}
        left="50%"
        transform="translateX(-50%)"
        w="full"
        maxW={404}
        px={4}
        pt={4}
        pb={6}
        zIndex={200}
        bg="dark.950"
      >
        <Dapp.Section>
          <DappTransaction.RequestingFrom mb={5} name={name} origin={origin} />
        </Dapp.Section>

        <DappTransaction.Fee
          closePopover={closePopover}
          fee={transactionSummary?.fee}
        />

        <Dialog.Actions hidden={showLoading} w="full" mt={4} hideDivider={true}>
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
            <Dialog.SecondaryAction
              size="lg"
              width="full"
              onClick={cancel}
              fontSize={14}
              isDisabled={primaryActionLoading}
            >
              Back
            </Dialog.SecondaryAction>
          )}
        </Dialog.Actions>
      </Box>
    </Container>
  );
};

export { DappTransactionWrapper };
