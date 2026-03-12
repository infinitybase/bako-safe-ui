import { FAKE_WITNESSES } from 'bakosafe';

import { ResolveTransactionCostInput } from '../services';

export const FAKE_SIGNATURES = Array.from({ length: 10 }, () => FAKE_WITNESSES);

export const createTxCostHash = (
  input: ResolveTransactionCostInput,
): string => {
  const { vault, assets: assetsToSpend } = input;
  const predicateAdd = vault.address.b256Address;
  const assetIds = assetsToSpend
    .map((a) => [a.assetId, a.amount].join(':'))
    .join('|');
  return `${predicateAdd}:${assetIds}`;
};
