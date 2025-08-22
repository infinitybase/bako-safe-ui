import { type UseNamedQueryParams, useProvider } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';
import { Provider } from 'fuels';
import { useMemo } from 'react';

type UseChainParams<TName extends string, TData> = {
  /**
   * Additional query parameters to customize the behavior of `useNamedQuery`.
   */
  query?: UseNamedQueryParams<TName, TData, Error, TData>;
};

export const useChainId = (
  params?: UseChainParams<'chainId', number | null>,
) => {
  const { provider: fuelProvider } = useProvider();

  const provider = useMemo(
    () => fuelProvider || new Provider(import.meta.env.VITE_PROVIDER_URL),
    [fuelProvider],
  );

  const { data, ...rest } = useQuery({
    queryKey: ['chainId', provider],
    queryFn: async () => {
      try {
        const currentFuelChain = await provider?.getChainId();
        return currentFuelChain ?? null;
      } catch (_error: unknown) {
        return null;
      }
    },
    placeholderData: null,
    enabled: !!provider,
    ...params?.query,
  });

  return {
    chainId: data,
    ...rest,
  };
};
