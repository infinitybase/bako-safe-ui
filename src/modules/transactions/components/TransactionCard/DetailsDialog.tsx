import {
  AccordionItem,
  Avatar,
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import {
  Dialog,
  DialogModalProps,
  DownLeftArrowGreen,
  UpRightArrow,
  UpRightArrowYellow,
} from '@/components';
import { ContractIcon } from '@/components/icons/tx-contract';
import { DeployIcon } from '@/components/icons/tx-deploy';
import { TransactionState } from '@/modules/core/models/transaction';
import { NetworkService } from '@/modules/network/services';
import {
  TransactionCard,
  transactionStatus,
  useVerifyTransactionInformations,
} from '@/modules/transactions';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useTransactionsContext } from '../../providers/TransactionsProvider';
import { TransactionWithVault } from '../../services/types';

interface DetailsDialogProps extends Omit<DialogModalProps, 'children'> {
  transaction: TransactionWithVault;
  account: string;
  status: TransactionState;
  isInTheVaultPage?: boolean;
  isSigner: boolean;
  isContract: boolean;
  callBack?: () => void;
}

const DetailsDialog = ({ ...props }: DetailsDialogProps) => {
  const { onClose, isOpen, transaction, account, status, isSigner } = props;
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

  const { isDeploy, isFromConnector, isDeposit, showAmountInformations } =
    useVerifyTransactionInformations(transaction);

  const {
    signTransaction: {
      confirmTransaction,
      declineTransaction,
      isLoading,
      isSuccess,
    },
  } = useTransactionsContext();

  const { isSigned, isCompleted, isDeclined, isReproved } = status;

  const awaitingAnswer =
    !isSigned && !isDeclined && !isCompleted && !isReproved && transaction;

  const showSignActions = awaitingAnswer && isSigner;

  return (
    <Dialog.Modal onClose={onClose} isOpen={isOpen}>
      <Dialog.Body as={AccordionItem} borderTop="none">
        <Dialog.Header
          onClose={onClose}
          w="full"
          maxW={{ base: 480, xs: 'unset' }}
          title="Transaction Details"
        />
        <VStack spacing={{ base: 3, xs: 5 }} display="block">
          <VStack w="full" spacing={4} justifyContent="space-between">
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
                    variant={'title-sm'}
                    color="grey.200"
                    textAlign="left"
                    wordBreak="break-all"
                    noOfLines={1}
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
                  variant="secondary"
                  h="28px"
                  p="6px 8px"
                  onClick={handleViewInExplorer}
                  rightIcon={
                    <Icon as={UpRightArrow} textColor="grey.75" fontSize="md" />
                  }
                >
                  View on Explorer
                </Button>
              )}
            </HStack>

            <HStack w="full" justifyContent="space-between" h="38px">
              <HStack w="75%">
                <Avatar
                  name={transaction.predicate?.name ?? ''}
                  color="grey.425"
                  bgColor="grey.925"
                  boxSize={6}
                  borderRadius="4px"
                  sx={{
                    '&>div': {
                      fontSize: '10px',
                    },
                  }}
                />

                <Heading
                  variant={'title-sm'}
                  color="grey.200"
                  textAlign="left"
                  noOfLines={1}
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
                showAmount={!showAmountInformations}
                transaction={transaction}
                w="fit-content"
                h="26px"
              />
              <TransactionCard.Status
                transaction={transaction}
                status={transactionStatus({
                  ...transaction,
                  account,
                })}
              />
            </HStack>
            {isLowerThanFourHundredAndThirty && isCompleted && (
              <Button
                mt={4}
                w="full"
                border="none"
                bgColor="#F5F5F50D"
                fontSize="xs"
                fontWeight="normal"
                letterSpacing=".5px"
                variant="secondary"
                h="28px"
                p="6px 8px"
                onClick={handleViewInExplorer}
                rightIcon={
                  <Icon as={UpRightArrow} textColor="grey.75" fontSize="md" />
                }
              >
                View on Explorer
              </Button>
            )}
          </VStack>

          <TransactionCard.Details
            transaction={transaction}
            isMobile
            isMobileDetailsOpen={isOpen}
          />
        </VStack>
      </Dialog.Body>

      <Dialog.Actions
        mt="auto"
        sx={{
          '&>hr': {
            marginTop: '0',
          },
        }}
      >
        {showSignActions ? (
          <>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                declineTransaction(transaction.hash);
              }}
              isLoading={isLoading}
              isDisabled={isSuccess && !awaitingAnswer}
            >
              Decline
            </Button>
            <Button
              variant="primary"
              w="full"
              isLoading={isLoading}
              isDisabled={isSuccess && !awaitingAnswer}
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
          <Button variant="secondary" w="full" onClick={onClose}>
            Back
          </Button>
        )}
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { DetailsDialog };
