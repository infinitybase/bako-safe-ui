import { useMutation } from 'react-query';

import { IPermissions, WorkspacesQueryKey } from '@/modules/core';
import { WorkspaceService } from '@/modules/workspace/services';

const useChangeMemberRequest = (workspaceId: string) =>
  useMutation(WorkspacesQueryKey.ADD_MEMBER(workspaceId), (members: string[]) =>
    WorkspaceService.updateMembers({ id: workspaceId, members }),
  );

const useChangePermissionsRequest = (workspaceId: string) =>
  useMutation(
    WorkspacesQueryKey.UPDATE_PERMISSION(workspaceId),
    (permissions: IPermissions) =>
      WorkspaceService.updatePermissions({ id: workspaceId, permissions }),
  );

export { useChangeMemberRequest, useChangePermissionsRequest };
