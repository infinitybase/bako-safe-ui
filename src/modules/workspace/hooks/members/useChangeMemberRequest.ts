import { useMutation } from '@tanstack/react-query';
import { Address } from 'fuels';

import { WorkspacesQueryKey } from '@/modules/core';
import {
  DeleteWorkspaceMemberPayload,
  IncludeWorkspaceMemberPayload,
  UpdateWorkspacePermissionsPayload,
  WorkspaceService,
} from '@/modules/workspace/services';

const useIncludeMemberRequest = () =>
  useMutation({
    mutationKey: WorkspacesQueryKey.ADD_MEMBER(),
    mutationFn: (userAddress: IncludeWorkspaceMemberPayload['address']) =>
      WorkspaceService.includeMember({
        address: new Address(userAddress).toString(),
      }),
  });

type ChangePermissionPayload = Omit<UpdateWorkspacePermissionsPayload, 'id'>;

const useChangePermissionsRequest = () =>
  useMutation({
    mutationKey: WorkspacesQueryKey.UPDATE_PERMISSION(),
    mutationFn: (payload: ChangePermissionPayload) =>
      WorkspaceService.updatePermissions({ ...payload }),
  });

const useDeleteMemberRequest = () =>
  useMutation({
    mutationKey: WorkspacesQueryKey.DELETE_MEMBER(),
    mutationFn: (payload: DeleteWorkspaceMemberPayload) =>
      WorkspaceService.deleteMember({ member: payload.member }),
  });

export {
  useChangePermissionsRequest,
  useDeleteMemberRequest,
  useIncludeMemberRequest,
};
