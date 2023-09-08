import { pageRoute } from './utils/routes';

const Pages = {
  example: pageRoute<{ id: string }>('/example/:id'),
  index: pageRoute('/'),
  home: pageRoute('/home'),
  createVault: pageRoute('/vault'),
  detailsVault: pageRoute<{ id: string }>('/vault/:id'),
  transactions: pageRoute<{ id: string }>('/vault/:id/transactions'),
  createTransaction: pageRoute<{ id: string }>(
    '/vault/:id/transactions/create',
  ),
  detailsTransaction: pageRoute<{ vaultId: string; transactionId: string }>(
    '/vault/:vaultId/transactions/:transactionId',
  ),
  signatures: pageRoute('/signatures'),
};

export { Pages };
