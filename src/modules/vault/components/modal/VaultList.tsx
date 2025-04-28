import { memo } from 'react';

import { PredicateAndWorkspace } from '../../services';
import { VaultItemBox } from './box';

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
      // workspace={vault.workspace}
      isActive={currentVaultId === vault.id}
      members={vault.members?.length}
      onClick={() => onSelectVault(vault)}
      // isSingleWorkspace={vault.workspace.single}
    />
  ));
};

export const VaultList = memo(VaultListComponent);
