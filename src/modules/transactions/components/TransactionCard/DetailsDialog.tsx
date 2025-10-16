import { Avatar, Button, Center, Heading, HStack, Icon, VStack } from 'bako-ui';
import { format } from 'date-fns';

import {
  Dialog,
  DialogModalProps,
  DownLeftArrowGreen,
  FileCodeIcon,
  UpRightArrow,
  UpRightArrowYellow,
} from '@/components';
import { ContractIcon } from '@/components/icons/tx-contract';
import { DeployIcon } from '@/components/icons/tx-deploy';
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
}

const DetailsDialog = ({ ...props }: DetailsDialogProps) => {
  const { onOpenChange, open, transaction, status, isSigner } = props;
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

  const {
    isDeploy,
    isFromConnector,
    isDeposit,
    isMint,
    showAmountInformations,
  } = useVerifyTransactionInformations(transaction);

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
      <Dialog.Body borderTop="none">
        <Dialog.Header
          onClose={() => onOpenChange?.({ open: false })}
          w="full"
          maxW={{ base: 480, sm: 'unset' }}
          title="Transaction Details"
        />
        <VStack gap={{ base: 3, sm: 5 }} display="block">
          <VStack w="full" gap={4} justifyContent="space-between">
            <HStack w="full">
              <HStack minH="38px">
                <Center
                  borderRadius="4px"
                  width={6}
                  height={6}
                  bgColor="grey.925"
                  padding="0 8px 0 8px"
                >
                  <Icon
                    color="grey.250"
                    fontSize="16px"
                    p="1.6px"
                    as={
                      isFromConnector
                        ? ContractIcon
                        : isDeploy
                          ? DeployIcon
                          : isDeposit
                            ? DownLeftArrowGreen
                            : UpRightArrowYellow
                    }
                  />
                </Center>
                <Center
                  w="fit-content"
                  alignItems="flex-start"
                  flexDir="column"
                  gridRow={2}
                >
                  <Heading
                    // variant={'title-sm'}
                    color="grey.200"
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
                  border="none"
                  bgColor="#F5F5F50D"
                  fontSize="xs"
                  fontWeight="normal"
                  letterSpacing=".5px"
                  ml="auto"
                  // variant="secondary"
                  h="28px"
                  p="6px 8px"
                  onClick={handleViewInExplorer}
                >
                  <UpRightArrow color="grey.75" fontSize="md" />
                  View on Explorer
                </Button>
              )}
            </HStack>

            <HStack w="full" justifyContent="space-between" h="38px">
              <HStack w="75%">
                <Avatar
                  color="grey.425"
                  bgColor="grey.925"
                  boxSize={6}
                  borderRadius="4px"
                  css={{
                    '&>div': {
                      fontSize: '10px',
                    },
                  }}
                  name={transaction.predicate?.name ?? ''}
                />

                <Heading
                  color="grey.200"
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
                    mt={4}
                    w="full"
                    border="none"
                    bgColor="#F5F5F50D"
                    fontSize="xs"
                    fontWeight="normal"
                    letterSpacing=".5px"
                    h="28px"
                    p="6px 8px"
                    onClick={handleViewInExplorer}
                  >
                    <UpRightArrow color="grey.75" fontSize="md" />
                    View on Explorer
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
                <Button
                  // variant="secondaryV2"
                  w="100%"
                  size="sm"
                  h={7}
                >
                  <FileCodeIcon fontSize="lg" />
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
        mt="auto"
        css={{
          '&>hr': {
            marginTop: '0',
          },
        }}
      >
        {showSignActions ? (
          <>
            <Button
              // variant="secondary"
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
              // variant="primary"
              w="full"
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
          </>
        ) : (
          <Button
            // variant="secondary"
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
