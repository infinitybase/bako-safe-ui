import { useMutation } from 'react-query';

import { WorkspacesQueryKey } from '@/modules/core';
import {
  IncludeWorkspaceMemberPayload,
  UpdateWorkspacePermissionsPayload,
  WorkspaceService,
} from '@/modules/workspace/services';

const useIncludeMemberRequest = (workspaceId: string) =>
  useMutation(
    WorkspacesQueryKey.ADD_MEMBER(workspaceId),
    (userAddress: IncludeWorkspaceMemberPayload['address']) =>
      WorkspaceService.includeMember({ id: workspaceId, address: userAddress }),
  );

type ChangePermissionPayload = Omit<UpdateWorkspacePermissionsPayload, 'id'>;

const useChangePermissionsRequest = (workspaceId: string) =>
  useMutation(
    WorkspacesQueryKey.UPDATE_PERMISSION(workspaceId),
    (payload: ChangePermissionPayload) =>
      WorkspaceService.updatePermissions({ id: workspaceId, ...payload }),
  );

export { useChangePermissionsRequest, useIncludeMemberRequest };
