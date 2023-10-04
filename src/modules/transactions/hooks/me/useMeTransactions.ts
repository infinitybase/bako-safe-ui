import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { SignatureUtils } from '@/modules';
import { useFuelAccount } from '@/modules/auth';

import { useMeTransactionsRequest } from './useMeTransactionsRequest';

const useMeTransactions = () => {
  const navigate = useNavigate();

  const { account } = useFuelAccount();
  const transactionsRequest = useMeTransactionsRequest(account);

  const transactions = useMemo(() => {
    return transactionsRequest.data
      ?.map((transaction) => {
        const isSigned = transaction?.witnesses?.some((signature) =>
          SignatureUtils.recoverSignerAddress(
            signature.signature!,
            `${transaction.hash}`,
          ),
        );
        return {
          ...transaction,
          isSigned,
        };
      })
      .sort((item) => (item.isSigned ? 1 : -1));
  }, [transactionsRequest.data]);

  const calculateSignatures = (signers: number, requiredSigners: number) =>
    (signers * 100) / requiredSigners;

  return {
    navigate,
    transactionsRequest: {
      transactions,
      ...transactionsRequest,
    },
    calculateSignatures,
  };
};

export { useMeTransactions };
