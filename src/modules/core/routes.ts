import { pageRoute } from './utils/routes';

const Pages = {
  home: pageRoute('/home'),
  index: pageRoute('/'),
  example: pageRoute<{ id: string }>('/example/:id'),
  createVault: pageRoute('/vault'),
  detailsVault: pageRoute<{ id: string }>('/vault/:id'),
  transactions: pageRoute<{ id: string }>('/vault/:id/transactions'),
};

export { Pages };
