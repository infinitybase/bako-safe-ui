import { PredicateMember } from '..';
import { IPredicate } from '../core/hooks/bakosafe/utils/types';

export const openFaucet = (vaultAddress: string) => {
  window.open(
    `${import.meta.env.VITE_FAUCET}?address=${vaultAddress}`,
    '_BLANK',
  );
};

export const ordinateMembers = (
  members: PredicateMember[],
  owner: IPredicate['owner'],
) => {
  if (!members || members.length === 0) return [];

  return members
    .map((member) => ({
      ...member,
      isOwner: member?.address === owner.address,
    }))
    .sort((a, b) => (a.isOwner === b.isOwner ? 0 : a.isOwner ? -1 : 1));
};
