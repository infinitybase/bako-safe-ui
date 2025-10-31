import { Grid, GridItem, HStack, Skeleton } from 'bako-ui';
import { memo, useMemo } from 'react';

import { PredicateAndWorkspace } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import CreateNewAccountCard from '../CreateNewAccountCard';
import RecentVaultsItem from '../RecentVaultsItem';
import ViewAllCard from '../ViewAllCard';

interface RecentVaultsListProps {
  predicates: PredicateAndWorkspace[];
  isLoading?: boolean;
}

const RecentVaultsList = memo(
  ({ isLoading = false, predicates }: RecentVaultsListProps) => {
    const {
      workspaceInfos: {
        handlers: { handleWorkspaceSelection },
        workspaceVaults: { extraCount, vaultsMax },
      },
      authDetails: { userInfos },
    } = useWorkspaceContext();

    const firstFivePredicates = useMemo(
      () => predicates.slice(0, vaultsMax),
      [predicates, vaultsMax],
    );

    const workspaceId = useMemo(
      () => userInfos.workspace?.id ?? '',
      [userInfos.workspace?.id],
    );

    const showViewAll = useMemo(() => extraCount > 0, [extraCount]);

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

        <GridItem>
          <HStack w="full" h="full" justify="stretch" gap={2.5}>
            <CreateNewAccountCard />
            {showViewAll && <ViewAllCard workspaceId={workspaceId} />}
          </HStack>
        </GridItem>
      </Grid>
    );
  },
);

RecentVaultsList.displayName = 'RecentVaultsList';

export default RecentVaultsList;
