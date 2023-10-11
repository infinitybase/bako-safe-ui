import { pageRoute } from './utils/routes';

const Pages = {
  example: pageRoute('/example'),
  exampleHome: pageRoute('/example/home'),
  index: pageRoute('/'),
  home: pageRoute('/home'),
  createVault: pageRoute('/vault'),
  detailsVault: pageRoute<{ id: string }>('/vault/:id'),
  userVaults: pageRoute('/vault/me'),
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
