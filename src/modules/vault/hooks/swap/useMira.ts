import { Vault } from 'bakosafe';
import { MiraAmm } from 'mira-dex-ts';
import { useMemo } from 'react';

export const useMira = ({ vault }: { vault?: Vault }) => {
  return useMemo(() => {
    if (vault) {
      return new MiraAmm(vault);
    }
  }, [vault]);
};
