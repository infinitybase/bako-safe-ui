import { Address } from 'fuels';
import { useMutation } from 'react-query';

import { WorkspacesQueryKey } from '@/modules/core';
import {
  DeleteWorkspaceMemberPayload,
  IncludeWorkspaceMemberPayload,
  UpdateWorkspacePermissionsPayload,
  WorkspaceService,
} from '@/modules/workspace/services';

const useIncludeMemberRequest = () =>
  useMutation(
    WorkspacesQueryKey.ADD_MEMBER(),
    (userAddress: IncludeWorkspaceMemberPayload['address']) =>
      WorkspaceService.includeMember({
        address: Address.fromString(userAddress).bech32Address,
      }),
  );

type ChangePermissionPayload = Omit<UpdateWorkspacePermissionsPayload, 'id'>;

const useChangePermissionsRequest = () =>
  useMutation(
    WorkspacesQueryKey.UPDATE_PERMISSION(),
    (payload: ChangePermissionPayload) =>
      WorkspaceService.updatePermissions({ ...payload }),
  );

const useDeleteMemberRequest = () =>
  useMutation(
    WorkspacesQueryKey.DELETE_MEMBER(),
    (payload: DeleteWorkspaceMemberPayload) =>
      WorkspaceService.deleteMember({ member: payload.member }),
  );
export {
  useChangePermissionsRequest,
  useDeleteMemberRequest,
  useIncludeMemberRequest,
};
