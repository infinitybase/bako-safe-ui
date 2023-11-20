import { pageRoute } from './utils/routes';

const Pages = {
  example: pageRoute('/example'),
  exampleHome: pageRoute('/example/home'),
  index: pageRoute('/'),
  home: pageRoute('/home'),
  createVault: pageRoute('/home/vault'),
  detailsVault: pageRoute<{ vaultId: string }>('/vault/:vaultId'),
  vaultSettings: pageRoute<{ vaultId: string }>('/vault/:vaultId/settings'),
  userVaults: pageRoute('/vault/me'),
  addressBook: pageRoute('/addressBook'),
  userTransactions: pageRoute('/transaction/me'),
  transactions: pageRoute<{ vaultId: string }>('/vault/:vaultId/transactions'),
  createTransaction: pageRoute<{ vaultId: string }>(
    '/vault/:vaultId/transactions/create',
  ),
  detailsTransaction: pageRoute<{ vaultId: string; transactionId: string }>(
    '/vault/:vaultId/transactions/:transactionId',
  ),
  signatures: pageRoute('/signatures'),

  //template
  createTemplate: pageRoute<{ vaultId: string }>('/template/:vaultId'),

  //dapp
  dappAuth: pageRoute('/dapp'),
  dappTransaction: pageRoute('/dapp/transaction'),
};

export { Pages };
