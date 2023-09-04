import { pageRoute } from './utils/routes';

const Pages = {
  home: pageRoute<{ id: string }>('/home'),
  index: pageRoute('/'),
  example: pageRoute<{ id: string }>('/example/:id'),
  createVault: pageRoute('/create-predicate'),
};

export { Pages };
