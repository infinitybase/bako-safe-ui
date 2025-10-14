import { Box, Button, Icon, Loader, toaster } from 'bako-ui';
import { useRef } from 'react';
import { IoIosWarning } from 'react-icons/io';
import { RiCloseCircleFill } from 'react-icons/ri';

import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';
import { NetworkService } from '@/modules/network/services';
import { useNotification } from '@/modules/notification';

type TransactionToastRef = Record<ITransaction['id'], string>;

const useTransactionToast = () => {
  const toast = useNotification();
  const transactionsToastRef = useRef<TransactionToastRef>({});

  const handleViewInExplorer = (hash: string, networkUrl: string) => {
    window.open(
      `${NetworkService.getExplorer(networkUrl)}/tx/0x${hash}`,
      '_BLANK',
    );
  };

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
    if (toaster.isVisible(transaction.id!)) return;
    // @ts-expect-error - ignore because is a reference to an object that will store the toast id
    transactionsToastRef.current[transaction.id!] = toast({
      position: 'top-right',
      duration: 100000,
      isClosable: true,
      title: 'Sending your transaction',
      icon: (
        <Loader
          css={{ '--spinner-track-color': 'dark.100' }}
          size="sm"
          color="brand.500"
        />
      ),
      description: transaction.name,
    });
  };

  const success = (transaction: ITransaction) => {
    const toastId = transactionsToastRef.current[transaction.id];

    if (toastId) {
      toaster.update(toastId, {
        type: 'success',
        title: 'Transaction success',
        duration: 5000,
        description: (
          <Box mt={2}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                const resume = transaction.resume;
                handleViewInExplorer(resume.hash, transaction.network.url);
              }}
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
      toaster.update(toastId, {
        type: 'error',
        duration: 5000,
        title: 'Error on send your transaction',
        description: message,
      });
    }
  };

  // todo: upgrade this function to use of all feedbacks
  const generalError = (id: string, title: string, message?: string) => {
    if (toaster.isVisible(id)) return;
    // @ts-expect-error - ignore because is a reference to an object that will store the toast id
    transactionsToastRef.current[id] = toast({
      status: 'error',
      duration: 5000,
      isClosable: true,
      title: title,
      icon: <Icon fontSize="xl" color="error.500" as={RiCloseCircleFill} />,
      description: message,
    });
  };

  const closeAll = () => toaster.dismiss();
  const close = (transaction: string) => {
    const toastId = transactionsToastRef.current[transaction];
    if (toastId) {
      toaster.dismiss(toastId);
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
