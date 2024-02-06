import { useQuery } from 'react-query';

import { HomeQueryKey } from '@/modules/core/models/home';

import { TransactionService } from '../../services';

const useTransactionsSignaturePending = (predicateId?: string[]) => {
  return useQuery([HomeQueryKey.FULL_DATA()], () => {
    return TransactionService.getTransactionsSignaturePending(predicateId);
  });
};

export { useTransactionsSignaturePending };
