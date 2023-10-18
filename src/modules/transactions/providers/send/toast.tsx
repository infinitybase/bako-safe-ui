import { CheckIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  CircularProgress,
  Icon,
  Text,
  ToastId,
} from '@chakra-ui/react';
import React, { useRef } from 'react';

import { ErrorIcon } from '@/components';
import { Transaction } from '@/modules/core';
import { useNotification } from '@/modules/notification';
import { sumEthAsset } from '@/modules/transactions';

type TransactionToastRef = Record<Transaction['id'], ToastId>;

const useTransactionToast = () => {
  const toast = useNotification();
  const transactionsToastRef = useRef<TransactionToastRef>({});

  const loading = (transaction: Transaction) => {
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
            ETH {sumEthAsset(transaction.assets)}
          </Text>
          <Text variant="description">{transaction.name}</Text>
        </>
      ),
    });
  };

  const success = (transaction: Transaction) => {
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
                const resume = JSON.parse(transaction.resume);
                window.open(resume.block, '_BLANK');
              }}
              variant="primary"
              size="xs"
            >
              View in explorer
            </Button>
          </Box>
        ),
      });
      removeToast(transaction);
    }
  };

  const error = (transaction: Transaction) => {
    const toastId = transactionsToastRef.current[transaction.id];

    if (toastId) {
      toast.update(toastId, {
        duration: 5000,
        title: 'Error on send your transaction',
        icon: <Icon fontSize="2xl" color="error.600" as={ErrorIcon} />,
      });
      removeToast(transaction);
    }
  };

  const removeToast = (transaction: Transaction) => {
    delete transactionsToastRef.current[transaction.id];
  };

  const closeAll = () => toast.closeAll({ positions: ['top-right'] });

  return {
    error,
    loading,
    success,
    closeAll,
  };
};

export { useTransactionToast };
