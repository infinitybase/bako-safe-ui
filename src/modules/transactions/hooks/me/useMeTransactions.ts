import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/modules/auth/store';
import { SignatureUtils } from '@/modules/core';

import { useMeTransactionsRequest } from './useMeTransactionsRequest';

const useMeTransactions = () => {
  const navigate = useNavigate();

  const { account } = useAuthStore();
  const transactionsRequest = useMeTransactionsRequest(account);

  const transactions = useMemo(() => {
    return transactionsRequest.data
      ?.map((transaction) => {
        const isSigned = transaction?.resume?.witnesses?.some((signature) =>
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
