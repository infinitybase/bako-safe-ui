import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../services';

export const checkPredicateBalancesQueryKey = {
  CHECK_PREDICATE_BALANCES_QUERY_KEY: (predicateId: string) => [
    'check-predicate-balances',
    predicateId,
  ],
};

export const CHECK_PREDICATE_BALANCES_QUERY_KEY = 'check-predicate-balances';

export const useCheckPredicateBalances = (predicateId: string) => {
  return useQuery({
    queryKey:
      checkPredicateBalancesQueryKey.CHECK_PREDICATE_BALANCES_QUERY_KEY(
        predicateId,
      ),
    queryFn: () => VaultService.checkPredicateBalances(predicateId),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 5, // 5 seconds
    enabled: !!predicateId,
  });
};
