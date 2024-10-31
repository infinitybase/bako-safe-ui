import { Dialog, SquarePlusIcon } from '@bako-safe/ui/components';
import { Button } from '@chakra-ui/react';

import { DappTransactionWrapper } from '@/components/transaction/wrapper';

import { useTransactionSocket } from '../hooks';

const TransactionConfirm = () => {
  // [CONNECTOR SIGNATURE]
  // const [createTxMethod, setCreateTxMethod] =
  //   useState<ECreateTransactionMethods>(
  //     ECreateTransactionMethods.CREATE_AND_SIGN,
  //   );

  const {
    vault,
    pendingSignerTransactions,
    summary,
    validAt,
    send: { isLoading, handler, cancel },
    isRedirectEnable,
    handleRedirectToBakoSafe,
  } = useTransactionSocket();

  const CreateTransactionButton = () => (
    <Dialog.PrimaryAction
      size="md"
      isLoading={isLoading}
      leftIcon={<SquarePlusIcon fontSize="lg" />}
      onClick={handler}
      fontWeight={700}
      fontSize={14}
    >
      Create transaction
    </Dialog.PrimaryAction>

    // [CONNECTOR SIGNATURE]
    // <CreateTxMenuButton
    //   createTxMethod={createTxMethod}
    //   setCreateTxMethod={setCreateTxMethod}
    //   isLoading={isLoading}
    //   isDisabled={isLoading}
    //   handleCreateTransaction={handler}
    //   handleCreateAndSignTransaction={redirectHandler}
    // />
  );

  const RedirectToBakoSafeButton = () => (
    <Button
      variant="outline"
      onClick={() => handleRedirectToBakoSafe()}
      w="full"
      borderColor="grey.75"
      fontWeight={500}
      fontSize="sm"
      letterSpacing=".5px"
      color="grey.75"
      _hover={{}}
      _active={{}}
    >
      Go to Bako Safe
    </Button>
  );

  return (
    <DappTransactionWrapper
      isRedirectEnable={isRedirectEnable}
      title="Create transaction"
      validAt={validAt}
      vault={vault}
      pendingSignerTransactions={pendingSignerTransactions}
      summary={summary}
      primaryActionButton={<CreateTransactionButton />}
      redirectButton={<RedirectToBakoSafeButton />}
      primaryActionLoading={isLoading}
      cancel={cancel}
    />
  );
};

export { TransactionConfirm };
