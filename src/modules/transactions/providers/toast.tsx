import {
  Box,
  Button,
  CircularProgress,
  Icon,
  Text,
  ToastId,
} from '@chakra-ui/react';
import { ITransaction } from 'bakosafe';
import { useRef } from 'react';
import { IoIosCheckmarkCircle, IoIosWarning } from 'react-icons/io';
import { RiCloseCircleFill } from 'react-icons/ri';

import { useNotification } from '@/modules/notification';

type TransactionToastRef = Record<ITransaction['id'], ToastId>;

const useTransactionToast = () => {
  const toast = useNotification();
  const transactionsToastRef = useRef<TransactionToastRef>({});

  const warning = (message: string, title: string) => {
    toast({
      status: 'warning',
      position: 'top-right',
      duration: 5000,
      isClosable: true,
      title: title,
      icon: <Icon fontSize="xl" color="brand.500" as={IoIosWarning} />,
      description: message,
    });
  };

  const loading = (transaction: Pick<ITransaction, 'id' | 'name'>) => {
    if (toast.isActive(transaction.id!)) return;
    transactionsToastRef.current[transaction.id!] = toast({
      position: 'top-right',
      duration: 100000,
      isClosable: true,
      title: 'Sending your transaction',
      icon: (
        <CircularProgress
          trackColor="dark.100"
          size={5}
          isIndeterminate
          color="brand.500"
        />
      ),
      description: <Text variant="description">{transaction.name}</Text>,
    });
  };

  const success = (transaction: ITransaction) => {
    const toastId = transactionsToastRef.current[transaction.id];

    if (toastId) {
      toast.update(toastId, {
        status: 'success',
        title: 'Transaction success',
        duration: 5000,
        icon: (
          <Icon fontSize="xl" color="success.700" as={IoIosCheckmarkCircle} />
        ),
        description: (
          <Box mt={2}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                const resume = transaction.resume;
                window.open(
                  `${import.meta.env.VITE_BLOCK_EXPLORER}/tx/0x${resume.hash}`,
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
        status: 'error',
        duration: 5000,
        title: 'Error on send your transaction',
        icon: <Icon fontSize="xl" color="error.500" as={RiCloseCircleFill} />,
        description: message,
      });
    }
  };

  // todo: upgrade this function to use of all feedbacks
  const generalError = (id: string, title: string, message?: string) => {
    if (toast.isActive(id)) return;
    transactionsToastRef.current[id] = toast({
      status: 'error',
      duration: 5000,
      isClosable: true,
      title: title,
      icon: <Icon fontSize="xl" color="error.500" as={RiCloseCircleFill} />,
      description: message,
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
