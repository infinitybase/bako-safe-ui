import { Box, Divider, Icon, Text, VStack } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  BakoLoading,
  CustomSkeleton,
  Dialog,
  LineCloseIcon,
  TransactionExpire,
} from '@/components';
import { DoneIcon } from '@/components/icons/done-icon';
import { Dapp } from '@/layouts/dapp';
import { Container } from '@/layouts/dapp/container';
import { useQueryParams } from '@/modules/auth/hooks';
import { VaultItemBox } from '@/modules/vault/components/modal/box';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { UseTransactionSocket, useVerifyBrowserType } from '../../hooks';
import { DappError } from '../connection';
import { DappTransaction } from '.';

interface DappTransactionWrapperProps {
  title: string;
  primaryActionLoading: boolean;
  primaryActionButton: ReactNode;
  redirectButton: ReactNode;
  validAt: UseTransactionSocket['validAt'];
  vault?: UseTransactionSocket['vault'];
  pendingSignerTransactions: UseTransactionSocket['pendingSignerTransactions'];
  isRedirectEnable: boolean;
  summary: UseTransactionSocket['summary'];
  cancel: UseTransactionSocket['send']['cancel'];
}

const DappTransactionWrapper = (props: DappTransactionWrapperProps) => {
  const {
    title,
    validAt,
    primaryActionButton,
    primaryActionLoading,
    vault,
    pendingSignerTransactions,
    summary: { transactionSummary, isPending: isLoadingTransactionSummary },
    cancel,
    redirectButton,
    isRedirectEnable,
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

  if (!transactionSummary) {
    return <BakoLoading />;
  }

  return (
    <Container>
      {isRedirectEnable ? (
        <VStack h="full" justifyContent="center" w="full">
          <VStack mt="auto">
            <Icon fontSize={120} as={DoneIcon} />
            <Text fontWeight={700} fontSize="20px" color="grey.75">
              Transaction created!
            </Text>
            <Text
              color="grey.250"
              fontSize="xs"
              fontWeight={400}
              lineHeight="16.8px"
            >
              Your transaction is pending to be signed. Sign at Bako Safe.
            </Text>
          </VStack>
          <Box w="full" mt="auto">
            {redirectButton}
          </Box>
        </VStack>
      ) : (
        <>
          <Box position="fixed" top={0} w="full" zIndex={100} left={0}>
            <TransactionExpire validAt={validAt} callBack={cancel} />
          </Box>
          <Dapp.Content maxW={404} bg="dark.950">
            <Dapp.Section mb={-7}>
              <Dapp.Header
                title={title}
                description="Send single or batch payments with multi assets. You can send multiple types of assets to different addresses."
                titleFontSize="16px"
                descriptionFontSize="12px"
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
              <Divider borderColor="dark.100" my={6} />
              {/* Essa box é usada como "parâmetro" para fechar o popover do max fee. */}
              <Box ref={inView?.ref} />
              {pendingSignerTransactions && (
                <Dapp.Section maxW={356}>
                  <DappError />
                </Dapp.Section>
              )}
              {/* Vault */}
              <Dapp.Section>
                <DappTransaction.RequestingFrom
                  mb={7}
                  name={name}
                  origin={origin}
                />

                {vault && (
                  <>
                    <Text mb={2} fontSize={12} fontWeight={700}>
                      Vault:
                    </Text>
                    <VaultItemBox
                      name={vault?.name}
                      address={vault?.address}
                      isSingleWorkspace
                      isInDapp
                      px={4}
                    />
                  </>
                )}
              </Dapp.Section>
              <Text mb={2} fontWeight={700} fontSize={12}>
                Details:
              </Text>
              <VStack spacing={1} mb={-4}>
                {(isLoadingTransactionSummary || !transactionSummary) && (
                  <DappTransaction.OperationSkeleton />
                )}
                {transactionSummary?.operations?.map((operation, index) => (
                  <DappTransaction.Operation
                    key={`${index}operation`}
                    vault={{
                      name: vault?.name || '',
                      predicateAddress: vault?.address || '',
                    }}
                    operation={operation}
                  />
                ))}
              </VStack>
              <DappTransaction.Fee
                closePopover={closePopover}
                fee={transactionSummary?.fee}
              />
              {/* Actions */}
              <Divider borderColor="grey.950" w="full" my={6} />
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
        </>
      )}
    </Container>
  );
};

export { DappTransactionWrapper };
