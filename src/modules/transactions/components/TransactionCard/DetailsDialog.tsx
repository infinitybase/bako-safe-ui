import {
  Avatar,
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  Stack,
  VStack,
} from 'bako-ui';
import { format } from 'date-fns';

import {
  Dialog,
  DialogModalProps,
  FileCodeIcon,
  UpRightArrow,
} from '@/components';
import env from '@/config/env';
import { TransactionState } from '@/modules/core/models/transaction';
import { NetworkService } from '@/modules/network/services';
import {
  TransactionCard,
  useVerifyTransactionInformations,
} from '@/modules/transactions';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useTransactionsContext } from '../../providers/TransactionsProvider';
import { TransactionWithVault } from '../../services/types';

interface DetailsDialogProps extends Omit<DialogModalProps, 'children'> {
  transaction: TransactionWithVault;
  status: TransactionState;
  isInTheVaultPage?: boolean;
  isSigner: boolean;
  isContract: boolean;
  callBack?: () => void;
  TransactionIcon: React.ElementType;
}

const DetailsDialog = ({ ...props }: DetailsDialogProps) => {
  const { onOpenChange, open, transaction, status, isSigner, TransactionIcon } =
    props;
  const {
    screenSizes: { isLowerThanFourHundredAndThirty },
  } = useWorkspaceContext();

  const handleViewInExplorer = () => {
    const { hash, network } = transaction;
    window.open(
      `${NetworkService.getExplorer(network.url)}/tx/0x${hash}`,
      '_BLANK',
    );
  };

  const { isDeposit, isMint, showAmountInformations } =
    useVerifyTransactionInformations(transaction);

  const {
    signTransaction: {
      confirmTransaction,
      declineTransaction,
      isLoading,
      isSuccess,
    },
  } = useTransactionsContext();

  const {
    isSigned,
    isCompleted,
    isDeclined,
    isReproved,
    isCanceled,
    isPendingProvider,
    isError,
  } = status;

  const awaitingAnswer =
    !isSigned &&
    !isDeclined &&
    !isCompleted &&
    !isReproved &&
    transaction &&
    !isPendingProvider;

  const showSignActions = awaitingAnswer && isSigner && !isCanceled && !isError;

  return (
    <Dialog.Modal onOpenChange={onOpenChange} open={open}>
      <Dialog.Body borderTop="none" pb="64px" px={1}>
        <Dialog.Header
          onClose={() => onOpenChange?.({ open: false })}
          w="full"
          maxW={{ base: 480, sm: 'unset' }}
          pt={6}
          title="Transaction Details"
        />
        <VStack gap={{ base: 3, sm: 5 }} display="block">
          <VStack w="full" gap={4} justifyContent="space-between">
            <HStack w="full">
              <HStack minH="38px">
                <Icon color="gray.200" boxSize="24px" as={TransactionIcon} />
                <Center
                  w="fit-content"
                  alignItems="flex-start"
                  flexDir="column"
                  gridRow={2}
                >
                  <Heading
                    color="textPrimary"
                    fontSize="md"
                    textAlign="left"
                    wordBreak="break-all"
                    lineClamp={1}
                  >
                    {transaction.name}
                  </Heading>
                </Center>
              </HStack>

              {!isLowerThanFourHundredAndThirty && isCompleted && (
                <Button
                  fontWeight="medium"
                  letterSpacing=".5px"
                  ml="auto"
                  variant="subtle"
                  size="xs"
                  px={3}
                  onClick={handleViewInExplorer}
                >
                  <UpRightArrow color="grey.75" boxSize={4} />
                  Explorer
                </Button>
              )}
            </HStack>

            <HStack w="full" justifyContent="space-between" h="38px">
              <HStack w="75%">
                <Avatar
                  borderRadius="4px"
                  css={{
                    '&>div': {
                      fontSize: '10px',
                    },
                  }}
                  name={transaction.predicate?.name ?? ''}
                />

                <Heading
                  color="textPrimary"
                  fontSize="md"
                  textAlign="left"
                  lineClamp={1}
                  wordBreak="break-all"
                >
                  {transaction.predicate?.name}
                </Heading>
              </HStack>
              <TransactionCard.CreationDate>
                {format(new Date(transaction?.createdAt), 'EEE, dd MMM')}
              </TransactionCard.CreationDate>
            </HStack>

            <HStack w="full" justifyContent="space-between" h="38px">
              <TransactionCard.Amount
                showAmount={!showAmountInformations || isDeposit || isMint}
                transaction={transaction}
                w="fit-content"
                h="26px"
              />
              <TransactionCard.Status
                transaction={transaction}
                status={status}
              />
            </HStack>
            {isLowerThanFourHundredAndThirty && (
              <>
                {isCompleted && (
                  <Button
                    variant="subtle"
                    size="xs"
                    mt={4}
                    w="full"
                    fontWeight="medium"
                    letterSpacing=".5px"
                    onClick={handleViewInExplorer}
                  >
                    <UpRightArrow color="gray.200" boxSize={4} />
                    Explorer
                  </Button>
                )}
              </>
            )}
            {!isDeposit && (
              <a
                href={`${env.BASE_API_URL}/transaction/${transaction.id}/advanced-details`}
                target="_blank"
                rel="noreferrer"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <Button variant="subtle" w="100%" size="xs">
                  <FileCodeIcon boxSize={4} />
                  Advanced details
                </Button>
              </a>
            )}
          </VStack>

          <TransactionCard.Details
            transaction={transaction}
            isMobile
            isMobileDetailsOpen={open}
          />
        </VStack>
      </Dialog.Body>

      <Dialog.Actions
        hideDivider
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        p={3}
        bg="bg.panel"
      >
        {showSignActions ? (
          <Stack direction="row" gap={3} w="full">
            <Button
              flex={1}
              colorPalette="red"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                declineTransaction(transaction.hash);
              }}
              loading={isLoading}
              disabled={isSuccess && !awaitingAnswer}
            >
              Decline
            </Button>
            <Button
              flex={1}
              loading={isLoading}
              disabled={isSuccess && !awaitingAnswer}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                confirmTransaction(transaction.id);
                props.callBack && props.callBack();
              }}
            >
              Sign
            </Button>
          </Stack>
        ) : (
          <Button
            variant="subtle"
            w="full"
            onClick={() => onOpenChange?.({ open: false })}
          >
            Back
          </Button>
        )}
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { DetailsDialog };
