import { CheckIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  CircularProgress,
  Icon,
  Text,
  ToastId,
} from '@chakra-ui/react';
import { ITransaction } from 'bsafe';
import { useRef } from 'react';

import { ErrorIcon } from '@/components';
import { useNotification } from '@/modules/notification';
import { sumEthAsset } from '@/modules/transactions';

type TransactionToastRef = Record<ITransaction['id'], ToastId>;

const useTransactionToast = () => {
  const toast = useNotification();
  const transactionsToastRef = useRef<TransactionToastRef>({});

  const warning = (message: string, title: string) => {
    toast({
      position: 'top-right',
      duration: 5000,
      isClosable: true,
      title: title,
      icon: <Icon fontSize="2xl" color="warning.500" as={ErrorIcon} />,
      description: <Text variant="description">{message}</Text>,
    });
  };

  const loading = (transaction: ITransaction) => {
    if (toast.isActive(transaction.id)) return;
    transactionsToastRef.current[transaction.id] = toast({
      position: 'top-right',
      duration: 100000,
      isClosable: true,
      title: 'Sending your transaction',
      icon: (
        <CircularProgress
          trackColor="dark.100"
          size={30}
          isIndeterminate
          color="brand.500"
        />
      ),
      description: (
        <>
          <Text variant="description">
            ETH{' '}
            {sumEthAsset(
              transaction.assets.map((transaction) => ({
                amount: transaction.amount,
                assetId: transaction.assetId,
                to: transaction.to,
              })),
            )}
          </Text>
          <Text variant="description">{transaction.name}</Text>
        </>
      ),
    });
  };

  const success = (transaction: ITransaction) => {
    const toastId = transactionsToastRef.current[transaction.id];

    if (toastId) {
      toast.update(toastId, {
        title: 'Transaction success',
        duration: 5000,
        icon: <Icon fontSize="2xl" color="brand.500" as={CheckIcon} />,
        description: (
          <Box mt={2}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                const resume = transaction.resume;
                window.open(
                  `${import.meta.env.VITE_BLOCK_EXPLORER}/transaction/${
                    resume.hash
                  }`,
                  '_BLANK',
                );
              }}
              variant="primary"
              size="xs"
            >
              View on explorer
            </Button>
          </Box>
        ),
      });
    }
  };

  const error = (transaction: string, message?: string) => {
    const toastId = transactionsToastRef.current[transaction];
    if (toastId) {
      toast.update(toastId, {
        duration: 5000,
        title: 'Error on send your transaction',
        icon: <Icon fontSize="2xl" color="error.600" as={ErrorIcon} />,
        description: message && (
          <Text variant="description" wordBreak="break-word">
            {message}
          </Text>
        ),
      });
    }
  };

  // todo: upgrade this function to use of all feedbacks
  const generalError = (id: string, title: string, message?: string) => {
    if (toast.isActive(id)) return;
    transactionsToastRef.current[id] = toast({
      position: 'top-right',
      duration: 5000,
      isClosable: true,
      title: title,
      icon: <Icon fontSize="2xl" color="error.600" as={ErrorIcon} />,
      description: (
        <>
          <Text variant="description">{message}</Text>
        </>
      ),
    });
  };

  const closeAll = () => toast.closeAll({ positions: ['top-right'] });
  const close = (transaction: string) => {
    const toastId = transactionsToastRef.current[transaction];
    if (toastId) {
      toast.close(toastId);
    }
  };
  return {
    error,
    loading,
    success,
    closeAll,
    close,
    generalError,
    warning,
  };
};

export { useTransactionToast };
