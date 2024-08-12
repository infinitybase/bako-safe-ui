import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { SignatureUtils } from '@/modules/core';

import { useMeTransactionsRequest } from './useMeTransactionsRequest';

import { useAuth } from '@/modules/auth';

export type IUseMeTransactionsReturn = ReturnType<typeof useMeTransactions>;

const useMeTransactions = () => {
  const navigate = useNavigate();
  const {
    userInfos: { workspace },
  } = useAuth();

  const transactionsRequest = useMeTransactionsRequest(workspace?.id);

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
    request: {
      transactions,
      ...transactionsRequest,
    },
    calculateSignatures,
  };
};

export { useMeTransactions };
