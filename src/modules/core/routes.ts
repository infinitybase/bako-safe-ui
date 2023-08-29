import { pageRoute } from './utils/routes';

const Pages = {
  index: pageRoute('/'),
  example: pageRoute<{ id: string }>('/example/:id'),
};

export { Pages };
