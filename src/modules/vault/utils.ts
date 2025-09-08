import { BN, bn } from 'fuels';

import { PredicateMember } from '..';
import { IPredicate } from '../core/hooks/bakosafe/utils/types';

export const openFaucet = (vaultAddress: string) => {
  window.open(
    `${import.meta.env.VITE_FAUCET}?address=${vaultAddress}`,
    '_BLANK',
  );
};

export const ordinateMembers = (
  members?: PredicateMember[],
  owner?: IPredicate['owner'],
) => {
  if (!members || members.length === 0) return [];

  return members
    .map((member) => ({
      ...member,
      isOwner: member?.address === owner?.address,
    }))
    .sort((a, b) => (a.isOwner === b.isOwner ? 0 : a.isOwner ? -1 : 1));
};

export const valueWithoutCommas = (value: string, locale: string): string => {
  if (!value) return '0';
  if (locale === 'pt-BR') {
    // If the value contains a comma, it is likely a decimal separator in some locales.
    // Replace commas with dots and remove dots.
    return value.replace(/\./g, '').replace(/,/g, '.');
  }

  return value.replace(/,/g, '');
};

export const parseToBN = (value: string, locale: string): BN => {
  try {
    // remove all dots and replace commas with dots
    // Ex: "1.500,50" → "1500.50" or "1,500.00" → "1500.00"
    const normalizedValue = valueWithoutCommas(value, locale);

    if (!normalizedValue || normalizedValue === '.') {
      return bn(0);
    }

    return bn.parseUnits(normalizedValue);
  } catch {
    return bn(0);
  }
};

export const splitToFiat = (value: number, fiatLocale: string) => {
  if (fiatLocale === 'pt-BR') {
    const [integer, decimal] = value.toString().split('.');

    return `${integer},${decimal ?? '00'}`;
  }
  return value.toString();
};
