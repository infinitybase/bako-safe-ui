import { useQuery } from '@tanstack/react-query';
import { isNumber } from 'lodash';

import { GarageService } from '../services/garage';
import { GarageQueryKeys } from '../utils/constants';
import { Networks } from '../utils/resolver-network';
import { useChainId } from './useChainId';

type useGetOrderProps = { id: string };

export const useGetOrder = ({ id }: useGetOrderProps) => {
  const { chainId } = useChainId();

  const { data: order, ...rest } = useQuery({
    queryKey: [GarageQueryKeys.ORDER, chainId, id],
    queryFn: async () => {
      const { data } = await GarageService.getOrder({
        orderId: id,
        chainId: chainId ?? Networks.MAINNET,
      });

      return data;
    },
    enabled: isNumber(chainId) && !!id,
  });

  return { order, ...rest };
};
