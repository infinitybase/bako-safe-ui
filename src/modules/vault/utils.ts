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

export const parseToNumber = (value: string): number => {
  const parsedValue = Number(value.replace('.', '').replace(/,/g, '.'));
  return isNaN(parsedValue) ? 0 : parsedValue;
};

export const removeRightZeroes = (value: string): string => {
  if (!value) return value;
  const parts = value.split('.');
  if (parts.length < 2) return value;
  const integerPart = parts[0];
  const decimalPart = parts[1].replace(/0+$/, ''); // Remove trailing zeroes
  return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
};
