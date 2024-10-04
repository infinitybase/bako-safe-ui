import { Dialog, SquarePlusIcon } from '@/components';

import { DappTransactionWrapper } from '../components/transaction/wrapper';
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

  return (
    <DappTransactionWrapper
      title="Create transaction"
      validAt={validAt}
      vault={vault}
      pendingSignerTransactions={pendingSignerTransactions}
      summary={summary}
      primaryActionButton={<CreateTransactionButton />}
      primaryActionLoading={isLoading}
      cancel={cancel}
    />
  );
};

export { TransactionConfirm };
