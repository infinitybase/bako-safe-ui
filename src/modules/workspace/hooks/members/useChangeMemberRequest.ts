import { Address } from 'fuels';
import { useMutation } from 'react-query';

import { WorkspacesQueryKey } from '@/modules/core';
import {
  DeleteWorkspaceMemberPayload,
  IncludeWorkspaceMemberPayload,
  UpdateWorkspacePermissionsPayload,
  WorkspaceService,
} from '@/modules/workspace/services';

const useIncludeMemberRequest = (workspaceId: string) =>
  useMutation(
    WorkspacesQueryKey.ADD_MEMBER(workspaceId),
    (userAddress: IncludeWorkspaceMemberPayload['address']) =>
      WorkspaceService.includeMember({
        address: Address.fromString(userAddress).bech32Address,
      }),
  );

type ChangePermissionPayload = Omit<UpdateWorkspacePermissionsPayload, 'id'>;

const useChangePermissionsRequest = (workspaceId: string) =>
  useMutation(
    WorkspacesQueryKey.UPDATE_PERMISSION(workspaceId),
    (payload: ChangePermissionPayload) =>
      WorkspaceService.updatePermissions({ ...payload }),
  );

const useDeleteMemberRequest = (workspaceId: string) =>
  useMutation(
    WorkspacesQueryKey.DELETE_MEMBER(workspaceId),
    (payload: DeleteWorkspaceMemberPayload) =>
      WorkspaceService.deleteMember({ member: payload.member }),
  );
export {
  useChangePermissionsRequest,
  useDeleteMemberRequest,
  useIncludeMemberRequest,
};
