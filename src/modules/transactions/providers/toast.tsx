import { Box, Button, Icon } from 'bako-ui';
import { RiCloseCircleFill } from 'react-icons/ri';

import { toaster } from '@/components/ui/toaster';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';
import { NetworkService } from '@/modules/network/services';
import { useNotification } from '@/modules/notification';

const useTransactionToast = () => {
  const toast = useNotification();

  const handleViewInExplorer = (hash: string, networkUrl: string) => {
    window.open(
      `${NetworkService.getExplorer(networkUrl)}/tx/0x${hash}`,
      '_BLANK',
    );
  };

  const warning = (message: string, title: string) => {
    toast({
      status: 'warning',
      // position: 'top-right',
      duration: 5000,
      isClosable: true,
      title: title,
      // icon: <Icon fontSize="xl" color="brand.500" as={IoIosWarning} />,
      description: message,
    });
  };

  const loading = (transaction: Pick<ITransaction, 'id' | 'name'>) => {
    toast({
      duration: 100000,
      status: 'loading',
      id: transaction.id,
      isClosable: true,
      title: 'Sending your transaction',
      description: transaction.name,
    });
  };

  const success = (transaction: ITransaction) => {
    toaster.update(transaction.id, {
      type: 'success',
      title: 'Transaction success',
      id: transaction.id,
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
  };

  const error = (transactionId: string, message?: string) => {
    toaster.update(transactionId, {
      type: 'error',
      duration: 5000,
      title: 'Error on send your transaction',
      description: message,
    });
  };

  // todo: upgrade this function to use of all feedbacks
  const generalError = (id: string, title: string, message?: string) => {
    if (toaster.isVisible(id)) return;
    toast({
      status: 'error',
      duration: 5000,
      isClosable: true,
      title: title,
      icon: <Icon fontSize="xl" color="error.500" as={RiCloseCircleFill} />,
      description: message,
    });
  };

  const closeAll = () => toaster.dismiss();
  const close = (transactionId: string) => {
    toaster.dismiss(transactionId);
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
