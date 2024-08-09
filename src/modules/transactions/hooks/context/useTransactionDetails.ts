import { useHomeTransactions } from '@/modules/home';
import { useMeTransactions } from '../me';
import { useTransactionList } from '../list';
import { useAuth } from '@/modules/auth';
import { useSignTransaction } from '../signature';
import { useState } from 'react';

export type IuseTransactionDetails = ReturnType<typeof useTransactionDetails>;

const useTransactionDetails = () => {
  const [requestInterval, setRequestInterval] = useState(1000 * 60 * 5);

  // Provavelmente usar cookies para salvar o wkId
  const {
    userInfos: { workspace },
  } = useAuth();

  const meTransactions = useMeTransactions();
  const homeTransactions = useHomeTransactions(workspace?.id);
  const transactionsPages = useTransactionList({ requestInterval });
  const signTransaction = useSignTransaction({
    transactionList: transactionsPages,
    meTransactions,
    homeTransactions,
    setRequestInterval,
  });

  return {
    meTransactions,
    homeTransactions,
    transactionsPages,
    signTransaction,
  };
};

export { useTransactionDetails };
