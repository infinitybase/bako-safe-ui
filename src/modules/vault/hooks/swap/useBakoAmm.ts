import { Vault } from 'bakosafe';
import { useMemo } from 'react';
import contracts from 'sway/artifacts/contract-ids.json';

import { getChainId } from '@/modules/core';
import BakoAMM from '@/modules/core/utils/bako-amm';

const getBakoAmmContractId = (chainId: number) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - contracts is a JSON object with chain IDs as keys
  const contract = contracts[chainId.toString()];
  return contract?.bakoSwap ?? null;
};

export const useBakoAmm = (vault?: Vault) => {
  return useMemo(() => {
    if (vault) {
      const chainId = getChainId();
      const contractId = getBakoAmmContractId(chainId);
      return new BakoAMM(vault, contractId);
    }
  }, [vault]);
};
