import type {
  DeleteWorkspaceMemberPayload,
  IncludeWorkspaceMemberPayload,
  UpdateWorkspacePermissionsPayload,
} from '@bako-safe/services';
import { useMutation } from '@tanstack/react-query';
import { Address } from 'fuels';

import { workspaceService } from '@/config/services-initializer';

import { WorkspacesQueryKey } from '../../utils';

const useIncludeMemberRequest = () =>
  useMutation({
    mutationKey: WorkspacesQueryKey.ADD_MEMBER(),
    mutationFn: (userAddress: IncludeWorkspaceMemberPayload['address']) =>
      workspaceService.includeMember({
        address: Address.fromString(userAddress).bech32Address,
      }),
  });

type ChangePermissionPayload = Omit<UpdateWorkspacePermissionsPayload, 'id'>;

const useChangePermissionsRequest = () =>
  useMutation({
    mutationKey: WorkspacesQueryKey.UPDATE_PERMISSION(),
    mutationFn: (payload: ChangePermissionPayload) =>
      workspaceService.updatePermissions({ ...payload }),
  });

const useDeleteMemberRequest = () =>
  useMutation({
    mutationKey: WorkspacesQueryKey.DELETE_MEMBER(),
    mutationFn: (payload: DeleteWorkspaceMemberPayload) =>
      workspaceService.deleteMember({ member: payload.member }),
  });

export {
  useChangePermissionsRequest,
  useDeleteMemberRequest,
  useIncludeMemberRequest,
};
