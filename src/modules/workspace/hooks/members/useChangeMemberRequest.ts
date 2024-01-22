import { useMutation } from 'react-query';

import { WorkspaceService } from '@/modules/workspace/services';

const useChangeMemberRequest = () =>
  useMutation('workspace/update/members', WorkspaceService.updateMembers);

const useChangePermissionsRequest = () =>
  useMutation(
    'workspace/update/permissions',
    WorkspaceService.updatePermissions,
  );

export { useChangeMemberRequest, useChangePermissionsRequest };
