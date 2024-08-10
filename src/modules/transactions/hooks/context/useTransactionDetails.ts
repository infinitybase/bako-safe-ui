import { useMeTransactions } from '../me';
import { useTransactionList } from '../list';
import { useAuth } from '@/modules/auth';
import { useSignTransaction } from '../signature';
import { useHomeTransactions } from '@/modules/home/hooks/useHomeTransactions';

export type IuseTransactionDetails = ReturnType<typeof useTransactionDetails>;

const useTransactionDetails = () => {
  // Provavelmente usar cookies para salvar o wkId
  const {
    userInfos: { workspace },
  } = useAuth();

  const meTransactions = useMeTransactions();
  const homeTransactions = useHomeTransactions(workspace?.id);
  const transactionsPageList = useTransactionList({
    workspaceId: workspace?.id,
    byMonth: true,
  });
  const signTransaction = useSignTransaction({
    transactionList: transactionsPageList,
    meTransactions,
  });

  return {
    meTransactions,
    homeTransactions,
    transactionsPageList,
    signTransaction,
  };
};

export { useTransactionDetails };
