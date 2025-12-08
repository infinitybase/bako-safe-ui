import { GridItem } from 'bako-ui';
import { memo } from 'react';

import { Pages, PredicateAndWorkspace, VaultCard } from '@/modules';

interface RecentVaultsItemProps {
  predicate: PredicateAndWorkspace;
  handleWorkspaceSelection: (workspaceId: string, path: string) => void;
}

const RecentVaultsItem = memo(
  ({ predicate, handleWorkspaceSelection }: RecentVaultsItemProps) => {
    return (
      <GridItem maxW={{ lg: '300px' }}>
        <VaultCard
          name={predicate.name}
          title={predicate.description}
          onClick={() =>
            handleWorkspaceSelection(
              predicate.workspace.id,
              Pages.detailsVault({
                workspaceId: predicate.workspace.id,
                vaultId: predicate.id,
              }),
            )
          }
          inHome
          signersCount={predicate?.members?.length || 0}
          requiredSigners={predicate?.configurable?.SIGNATURES_COUNT || 0}
          isHidden={predicate.isHidden}
          id={predicate.id}
          workspaceId={predicate.workspace.id}
          address={predicate.predicateAddress}
        />
      </GridItem>
    );
  },
);

RecentVaultsItem.displayName = 'RecentVaultsItem';

export default RecentVaultsItem;
