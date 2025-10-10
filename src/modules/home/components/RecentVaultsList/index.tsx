import { Box, Grid, Text } from '@chakra-ui/react';
import { Fragment, memo } from 'react';

import { PredicateAndWorkspace } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import RecentVaultsItem from '../RecentVaultsItem';

interface RecentVaultsListProps {
  predicates: PredicateAndWorkspace[];
  isLoading?: boolean;
}

const RecentVaultsList = memo(
  ({ isLoading = false, predicates }: RecentVaultsListProps) => {
    const {
      workspaceInfos: {
        handlers: { navigate, handleWorkspaceSelection },
        workspaceVaults: { extraCount, vaultsMax },
      },
      authDetails: { userInfos },
    } = useWorkspaceContext();

    return (
      <Fragment>
        <Box pb={9} alignSelf="flex-start">
          <Text
            color="grey.400"
            // variant="subtitle"
            fontWeight="semibold"
            fontSize="md"
          >
            Recently used vaults
          </Text>
        </Box>
        <Grid
          mt={{ base: -8, sm: -2 }}
          w="full"
          maxW="full"
          gap={6}
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            '2xl': 'repeat(4, 1fr)',
          }}
        >
          {predicates.map((predicate, index) => (
            <RecentVaultsItem
              predicate={predicate}
              extraCount={extraCount}
              isLastVault={index === vaultsMax - 1}
              userInfos={userInfos}
              onNavigate={navigate}
              handleWorkspaceSelection={handleWorkspaceSelection}
              isLoading={isLoading}
              key={predicate.id}
            />
          ))}
        </Grid>
      </Fragment>
    );
  },
);

RecentVaultsList.displayName = 'RecentVaultsList';

export default RecentVaultsList;
