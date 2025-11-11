import { memo } from 'react';

import { PredicateAndWorkspace } from '../../services';
import { VaultItemBox } from './box';

const getSignaturesCount = (vault: PredicateAndWorkspace) => {
  const { SIGNATURES_COUNT } = typeof vault.configurable === 'string' ? JSON.parse(vault.configurable) : vault.configurable;
  return SIGNATURES_COUNT
}

interface VaultListProps {
  vaults: PredicateAndWorkspace[];
  currentVaultId: string;
  onSelectVault: (vault: PredicateAndWorkspace) => void;
}

const VaultListComponent = ({
  vaults,
  currentVaultId,
  onSelectVault,
}: VaultListProps) => {
  return vaults?.map((vault) => (
    <VaultItemBox
      key={vault.id}
      mt={4}
      id={vault.id}
      name={vault.name}
      address={vault.predicateAddress}
      root={vault.root}
      workspace={vault.workspace}
      requiredSigners={getSignaturesCount(vault)}
      isActive={currentVaultId === vault.id}
      members={vault.members?.length}
      onClick={() => onSelectVault(vault)}
    />
  ));
};

export const VaultList = memo(VaultListComponent);
