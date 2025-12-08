import { Grid, GridItem, Skeleton } from 'bako-ui';
import { memo, useMemo } from 'react';

import { PredicateAndWorkspace } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import RecentVaultsItem from '../RecentVaultsItem';

interface RecentVaultsListProps {
  predicates: PredicateAndWorkspace[];
  isLoading?: boolean;
}

const RecentVaultsList = memo(
  ({ isLoading = false, predicates }: RecentVaultsListProps) => {
    const {
      workspaceInfos: {
        handlers: { handleWorkspaceSelection },
        workspaceVaults: { vaultsMax },
      },
    } = useWorkspaceContext();

    const firstFivePredicates = useMemo(
      () => predicates.slice(0, vaultsMax),
      [predicates, vaultsMax],
    );

    return (
      <Grid
        w="full"
        gap={6}
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {!isLoading &&
          firstFivePredicates.map((predicate) => (
            <RecentVaultsItem
              predicate={predicate}
              handleWorkspaceSelection={handleWorkspaceSelection}
              key={predicate.id}
            />
          ))}

        {isLoading && (
          <GridItem>
            <Skeleton height="150px" rounded="2xl" />
          </GridItem>
        )}
      </Grid>
    );
  },
);

RecentVaultsList.displayName = 'RecentVaultsList';

export default RecentVaultsList;
