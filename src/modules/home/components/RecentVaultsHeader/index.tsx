import { Heading, HStack } from 'bako-ui';
import { memo, useMemo } from 'react';

import { useWorkspaceContext } from '@/modules/workspace/hooks';

import CreateNewAccountButton from '../CreateNewAccountButton';
import ViewAllButton from '../ViewAllButton';

const RecentVaultsHeader = memo(() => {
  const {
    workspaceInfos: {
      workspaceVaults: { extraCount },
    },
    authDetails: { userInfos },
  } = useWorkspaceContext();

  const workspaceId = useMemo(
    () => userInfos.workspace?.id ?? '',
    [userInfos.workspace?.id],
  );

  const showViewAll = useMemo(() => extraCount > 0, [extraCount]);

  return (
    <HStack w="full" justifyContent="space-between">
      <Heading color="textPrimary" fontSize="sm" fontWeight="semibold">
        My accounts
      </Heading>

      <HStack flex={1} justifyContent="flex-end">
        <CreateNewAccountButton />
        {showViewAll && <ViewAllButton workspaceId={workspaceId} />}
      </HStack>
    </HStack>
  );
});

RecentVaultsHeader.displayName = 'RecentVaultsHeader';

export default RecentVaultsHeader;
