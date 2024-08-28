import {
  Avatar,
  Box,
  Card,
  Divider,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { CustomSkeleton, Dialog, TransactionExpire } from '@/components';
import { LineCloseIcon, SquarePlusIcon } from '@/components/icons';
import { Dapp } from '@/layouts/dapp';
import { useQueryParams } from '@/modules/auth';
import { DappError, DappTransaction } from '@/modules/dapp/components';
import { VaultDrawerBox } from '@/modules/vault/components/drawer/box';

import { useTransactionSocket, useVerifyBrowserType } from '../hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const TransactionConfirm = () => {
  const {
    cancelTransaction,
    vault,
    pendingSignerTransactions,
    summary: { transactionSummary, isPending: isLoadingTransactionSummary },
    isLoading,
    send,
    validAt,
  } = useTransactionSocket();

  const {
    workspaceInfos: {
      handlers: { goHome },
    },
  } = useWorkspaceContext();

  const [closePopover, setClosePopover] = useState(false);

  const inView = useInView();

  const { sessionId, request_id, name, origin } = useQueryParams();

  const { isSafariBrowser } = useVerifyBrowserType();

  if (!sessionId || !request_id) {
    window.close();
    goHome();
  }

  useEffect(() => {
    setClosePopover(inView.inView);
  }, [inView.inView]);

  return (
    <>
      <Box position="fixed" top={0} w="full" zIndex={100} left={0}>
        <TransactionExpire validAt={validAt} callBack={cancelTransaction} />
      </Box>
      <Dapp.Content maxW={404} bg="dark.950">
        <Dapp.Section mb={-7}>
          <Dapp.Header
            title="Create transaction"
            description="Send single or batch payments with multi assets. You can send multiple types of assets to different addresses."
            titleFontSize="16px"
            descriptionFontSize="12px"
          />

          {isSafariBrowser && (
            <LineCloseIcon
              onClick={cancelTransaction}
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
            <Card h={106} gap={4} bg="transparent" mb={8}>
              <Text fontSize={12} color="grey.50" fontWeight={700}>
                Requesting a transaction from:
              </Text>
              <Card
                bgColor="grey.825"
                borderColor="dark.100"
                borderRadius={8}
                p={4}
                borderWidth="1px"
                height={24}
              >
                <HStack width="100%" spacing={4} h="49px">
                  <Avatar
                    variant="roundedSquare"
                    color="white"
                    bgColor="dark.950"
                    boxSize={10}
                    name={name!}
                  />
                  <VStack alignItems="flex-start" spacing={0}>
                    <Text variant="subtitle" color="grey.250">
                      {name}
                    </Text>
                    <Text
                      color="brand.500"
                      variant="description"
                      lineHeight={4}
                    >
                      {origin?.split('//')[1]}
                      {/* bakoconnector-git-gr-featbakosafe-infinity-base.vercel.app */}
                    </Text>
                  </VStack>
                </HStack>
              </Card>
            </Card>

            {vault && (
              <>
                <Text mb={2} fontSize={12} fontWeight={700}>
                  Vault:
                </Text>
                <VaultDrawerBox
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
                  onClick={cancelTransaction}
                  isDisabled={isLoading}
                  borderColor="grey.75"
                  fontSize={14}
                >
                  Cancel
                </Dialog.SecondaryAction>
                <Dialog.PrimaryAction
                  size="md"
                  isLoading={isLoading}
                  leftIcon={<SquarePlusIcon fontSize="lg" />}
                  onClick={send}
                  fontWeight={700}
                  fontSize={14}
                >
                  Create transaction
                </Dialog.PrimaryAction>
              </>
            ) : (
              <>
                <Dialog.SecondaryAction
                  size="lg"
                  width="full"
                  onClick={cancelTransaction}
                  fontSize={14}
                  isDisabled={isLoading}
                >
                  Back
                </Dialog.SecondaryAction>
              </>
            )}
          </Dialog.Actions>
        </CustomSkeleton>
      </Dapp.Content>
    </>
  );
};

export { TransactionConfirm };
