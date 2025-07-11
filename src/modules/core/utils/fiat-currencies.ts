import { hashMessage } from 'fuels';

import { AssetMap } from '..';

export const FIAT_CURRENCIES_ASSET_IDS = Object.freeze({
  USD: hashMessage('USD'),
  EUR: hashMessage('EUR'),
  BRL: hashMessage('BRL'),
});

export const FIAT_CURRENCIES_ASSET_MAP: AssetMap = {
  [FIAT_CURRENCIES_ASSET_IDS.USD]: Object.freeze({
    name: 'USD',
    slug: 'USD',
    assetId: FIAT_CURRENCIES_ASSET_IDS.USD,
    metadata: {},
    units: 2,
    icon: '/tokens/usd.svg',
  }),
  [FIAT_CURRENCIES_ASSET_IDS.EUR]: Object.freeze({
    name: 'EUR',
    slug: 'EUR',
    assetId: FIAT_CURRENCIES_ASSET_IDS.EUR,
    metadata: {},
    units: 2,
    icon: '/tokens/eur.svg',
  }),
  [FIAT_CURRENCIES_ASSET_IDS.BRL]: Object.freeze({
    name: 'BRL',
    slug: 'BRL',
    assetId: FIAT_CURRENCIES_ASSET_IDS.BRL,
    metadata: {},
    units: 2,
    icon: '/tokens/brl.svg',
  }),
};
