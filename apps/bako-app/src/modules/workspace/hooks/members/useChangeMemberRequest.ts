import {
  DeleteWorkspaceMemberPayload,
  IncludeWorkspaceMemberPayload,
  UpdateWorkspacePermissionsPayload,
  WorkspaceService,
} from '@bako-safe/services/modules/workspace';
import { useMutation } from '@tanstack/react-query';
import { Address } from 'fuels';

import { WorkspacesQueryKey } from '../../utils';

const useIncludeMemberRequest = () =>
  useMutation({
    mutationKey: WorkspacesQueryKey.ADD_MEMBER(),
    mutationFn: (userAddress: IncludeWorkspaceMemberPayload['address']) =>
      WorkspaceService.includeMember({
        address: Address.fromString(userAddress).bech32Address,
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
