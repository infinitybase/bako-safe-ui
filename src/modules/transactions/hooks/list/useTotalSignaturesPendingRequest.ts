import { useQuery } from 'react-query';

import { HomeQueryKey } from '@/modules/core/models/home';

import { TransactionService } from '../../services';

const useTransactionsSignaturePending = () => {
  return useQuery([HomeQueryKey.FULL_DATA()], () =>
    TransactionService.getTransactionsSignaturePending(),
  );
};

export { useTransactionsSignaturePending };
