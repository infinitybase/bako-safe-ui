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
  vaultSettings: pageRoute<{ vaultId: string }>('/vault/:vaultId/settings'),
  userVaults: pageRoute<{ workspaceId: string }>(
    '/workspace/:workspaceId/vault/me',
  ),
  // userVaults: pageRoute('/workspace/:workspaceId/vault/me'),

  addressBook: pageRoute<{ workspaceId: string }>(
    '/workspace/:workspaceId/address-book',
  ),

  //template
  createTemplate: pageRoute<{ vaultId: string }>(
    '/vault/:vaultId/template/create',
  ),

  //transaction
  createTransaction: pageRoute<{ vaultId: string; workspaceId: string }>(
    '/workspace/:workspaceId/vault/:vaultId/transactions/create',
  ),

  detailsTransaction: pageRoute<{ vaultId: string; transactionId: string }>(
    '/vault/:vaultId/transactions/:transactionId',
  ),

  userTransactions: pageRoute<{
    workspaceId: string;
  }>('/workspace/:workspaceId/transaction/me'),

  transactions: pageRoute<{ vaultId: string }>('/vault/:vaultId/transactions'),

  signatures: pageRoute('/signatures'),

  //dapp
  dappAuth: pageRoute('/dapp'),
  dappTransaction: pageRoute('/dapp/transaction'),

  //workspace
  createWorkspace: pageRoute('/workspace/create'),
  membersWorkspace: pageRoute<{ workspaceId: string }>(
    '/workspace/:workspaceId/members',
  ),
  updateMemberWorkspace: pageRoute<{
    workspaceId: string;
    memberId: string;
  }>('/workspace/:workspaceId/members/:memberId'),
  workspace: pageRoute<{ workspaceId: string }>('/workspace/:workspaceId'),
  workspaceTransactions: pageRoute<{ workspaceId: string }>(
    'workspace/:WorkspaceId/transaction/me',
  ),
};

export { Pages };
