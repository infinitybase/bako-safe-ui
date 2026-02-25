import { pageRoute } from './utils/routes';

const Pages = {
  example: pageRoute('/example'),
  exampleHome: pageRoute('/example/home'),
  index: pageRoute('/'),
  home: pageRoute('/home'),
  // createVault: pageRoute('/home/vault'),
  createVault: pageRoute<{ workspaceId: string }>(
    '/workspace/:workspaceId/vault',
  ),
  detailsVault: pageRoute<{ workspaceId: string; vaultId: string }>(
    '/workspace/:workspaceId/vault/:vaultId',
  ),
  vaultBalance: pageRoute<{ workspaceId: string; vaultId: string }>(
    '/workspace/:workspaceId/vault/:vaultId/balance',
  ),
  vaultSettings: pageRoute<{ workspaceId: string; vaultId: string }>(
    '/workspace/:workspaceId/vault/:vaultId/settings',
  ),
  vaultBuySell: pageRoute<{ workspaceId: string; vaultId: string }>(
    '/workspace/:workspaceId/vault/:vaultId/buy-sell',
  ),
  vaultBuySellSession: pageRoute<{
    workspaceId: string;
    vaultId: string;
    sessionId: string;
  }>('/workspace/:workspaceId/vault/:vaultId/buy-sell/session/:sessionId'),
  userVaults: pageRoute<{ workspaceId: string }>(
    '/workspace/:workspaceId/list/vault/me',
  ),
  vaultSwap: pageRoute<{ workspaceId: string; vaultId: string }>(
    '/workspace/:workspaceId/vault/:vaultId/swap',
  ),

  addressBook: pageRoute<{ workspaceId: string }>(
    '/workspace/:workspaceId/address-book',
  ),

  userTransactions: pageRoute<{ workspaceId: string }>(
    '/workspace/:workspaceId/transaction/me',
  ),

  transactions: pageRoute<{ workspaceId: string; vaultId: string }>(
    '/workspace/:workspaceId/vault/:vaultId/transactions',
  ),

  //template
  createTemplate: pageRoute<{ vaultId: string; workspaceId: string }>(
    '/workspace/:workspaceId/vault/:vaultId/template/create',
  ),

  //transaction
  createTransaction: pageRoute<{ vaultId: string; workspaceId: string }>(
    '/workspace/:workspaceId/vault/:vaultId/transactions/create',
  ),

  detailsTransaction: pageRoute<{ vaultId: string; transactionId: string }>(
    '/vault/:vaultId/transactions/:transactionId',
  ),

  //dapp
  dappAuth: pageRoute('/dapp'),
  dappTransaction: pageRoute('/dapp/transaction'),
  dappSign: pageRoute('/dapp/sign/:message'),
  dappNetwork: pageRoute('/dapp/network'),

  //terms
  termsOfUse: pageRoute('/terms-of-use'),

  //workspace
  membersWorkspace: pageRoute<{ workspaceId: string }>(
    '/workspace/:workspaceId/members',
  ),

  updateMemberWorkspace: pageRoute<{
    workspaceId: string;
    memberId: string;
  }>('/workspace/:workspaceId/members/:memberId'),

  balanceWorkspace: pageRoute<{ workspaceId: string }>(
    '/workspace/:workspaceId/balance',
  ),

  bridge: pageRoute<{ vaultId: string; workspaceId: string }>(
    '/workspace/:workspaceId/vault/:vaultId/bridge',
  ),

  workspace: pageRoute<{ workspaceId: string }>('/workspace/:workspaceId'),
  // workspaceTransactions: pageRoute<{ workspaceId: string }>(
  //   'workspace/:WorkspaceId/transaction/me',
  // ),
};

export { Pages };
