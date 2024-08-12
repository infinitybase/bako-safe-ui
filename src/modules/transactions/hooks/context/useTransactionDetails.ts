import { usePredicateTransactions } from '../predicate';
import { useTransactionList } from '../list';
import { useAuth } from '@/modules/auth';
import { useSignTransaction } from '../signature';
import { useHomeTransactions } from '@/modules/home/hooks/useHomeTransactions';

export type IuseTransactionDetails = ReturnType<typeof useTransactionDetails>;

const useTransactionDetails = () => {
  const {
    userInfos: { workspace },
  } = useAuth();

  const predicateTransactions = usePredicateTransactions();
  const homeTransactions = useHomeTransactions(workspace?.id);
  const transactionsPageList = useTransactionList({
    workspaceId: workspace?.id,
    byMonth: true,
  });
  const signTransaction = useSignTransaction({
    transactionList: transactionsPageList,
    predicateTransactions,
  });

  return {
    predicateTransactions,
    homeTransactions,
    transactionsPageList,
    signTransaction,
  };
};

export { useTransactionDetails };
