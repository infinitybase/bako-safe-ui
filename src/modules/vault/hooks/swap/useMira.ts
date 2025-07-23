import { Vault } from 'bakosafe';
import { MiraAmm } from 'mira-dex-ts';
import { useMemo } from 'react';

export const useMira = ({ vault }: { vault?: Vault }) => {
  return useMemo(() => {
    if (vault) {
      try {
        const amm = new MiraAmm(vault);
        console.log('Initializing Mira AMM with vault:', vault);
        return amm;
      } catch (error) {
        console.error('Failed to initialize Mira AMM:', error);
        return undefined;
      }
    }
  }, [vault]);
};
