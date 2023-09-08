import { useQuery } from 'react-query';

import { TransactionService } from '@/modules/transactions/services';

const useMeTransactionsRequest = (address: string) => {
  return useQuery(['transaction/by-address', address], async () =>
    address ? TransactionService.getByAddress(address) : [],
  );
};

export { useMeTransactionsRequest };
