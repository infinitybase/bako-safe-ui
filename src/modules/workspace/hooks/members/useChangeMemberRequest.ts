import { useMutation } from '@tanstack/react-query';
import { Address } from 'fuels';

import { WorkspacesQueryKey } from '@/modules/core';
import {
  DeleteWorkspaceMemberPayload,
  IncludeWorkspaceMemberPayload,
  UpdateWorkspacePermissionsPayload,
  WorkspaceService,
} from '@/modules/workspace/services';

const useIncludeMemberRequest = (workspaceId: string) =>
  useMutation({
    mutationKey: WorkspacesQueryKey.ADD_MEMBER(workspaceId),
    mutationFn: (userAddress: IncludeWorkspaceMemberPayload['address']) =>
      WorkspaceService.includeMember({
        id: workspaceId,
        address: Address.fromString(userAddress).bech32Address,
      }),
  });

type ChangePermissionPayload = Omit<UpdateWorkspacePermissionsPayload, 'id'>;

const useChangePermissionsRequest = (workspaceId: string) =>
  useMutation({
    mutationKey: WorkspacesQueryKey.UPDATE_PERMISSION(workspaceId),
    mutationFn: (payload: ChangePermissionPayload) =>
      WorkspaceService.updatePermissions({ id: workspaceId, ...payload }),
  });

const useDeleteMemberRequest = (workspaceId: string) =>
  useMutation({
    mutationKey: WorkspacesQueryKey.DELETE_MEMBER(workspaceId),
    mutationFn: (payload: DeleteWorkspaceMemberPayload) =>
      WorkspaceService.deleteMember({ id: payload.id, member: payload.member }),
  });

export {
  useChangePermissionsRequest,
  useDeleteMemberRequest,
  useIncludeMemberRequest,
};
