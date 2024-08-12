import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { SignatureUtils } from '@/modules/core';

import { usePredicateTransactionsRequest } from './usePredicateTransactionsRequest';

import { useAuth } from '@/modules/auth';

export type IUsePredicateTransactionsReturn = ReturnType<
  typeof usePredicateTransactions
>;

const usePredicateTransactions = () => {
  const navigate = useNavigate();
  const {
    userInfos: { workspace },
  } = useAuth();

  const { data, isLoading, isFetching, refetch } =
    usePredicateTransactionsRequest(workspace?.id);

  const transactions = useMemo(() => {
    return data
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
  }, [data]);

  const calculateSignatures = (signers: number, requiredSigners: number) =>
    (signers * 100) / requiredSigners;

  return {
    navigate,
    lists: {
      transactions,
    },
    request: {
      isLoading,
      isFetching,
      refetch,
    },
    calculateSignatures,
  };
};

export { usePredicateTransactions };
