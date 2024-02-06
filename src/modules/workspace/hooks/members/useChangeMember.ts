import { useNavigate, useParams } from 'react-router-dom';

import { useAddressBook } from '@/modules/addressBook';
import {
  defaultPermissions,
  EnumUtils,
  Pages,
  PermissionRoles,
  useTab,
} from '@/modules/core';

import { useGetWorkspaceRequest } from '../useGetWorkspaceRequest';
import { useChangeMemberForm } from './useChangeMemberForm';
import {
  useChangePermissionsRequest,
  useDeleteMemberRequest,
  useIncludeMemberRequest,
} from './useChangeMemberRequest';

export enum MemberTabState {
  ADDRESS = 0,
  PERMISSION = 1,
  SUCCESS = 2,
}

export type UseChangeMember = ReturnType<typeof useChangeMember>;

const useChangeMember = () => {
  const navigate = useNavigate();
  const params = useParams<{ workspaceId: string; memberId: string }>();
  const isEditMember = !!params.memberId;

  const tabs = useTab<MemberTabState>({
    tabs: EnumUtils.toNumberArray(MemberTabState),
    defaultTab: isEditMember
      ? MemberTabState.PERMISSION
      : MemberTabState.ADDRESS,
  });

  const { memberForm, permissionForm, editForm, setMemberValuesByWorkspace } =
    useChangeMemberForm();
  const addressBook = useAddressBook();

  const workspaceRequest = useGetWorkspaceRequest(params.workspaceId!, {
    onSuccess: (workspace) => {
      if (!isEditMember) return;

      setMemberValuesByWorkspace(workspace, params.memberId);
    },
  });

  const memberRequest = useIncludeMemberRequest(params.workspaceId!);
  const permissionsRequest = useChangePermissionsRequest(params.workspaceId!);
  const deleteRequest = useDeleteMemberRequest(params.workspaceId!);

  const handleClose = () =>
    navigate(Pages.workspace({ workspaceId: params.workspaceId! }));

  const handleAddMember = memberForm.handleSubmit((data) => {
    memberRequest.mutate(data.address, {
      onSuccess: () => {
        tabs.set(MemberTabState.PERMISSION);
        workspaceRequest.refetch();
      },
    });
  });

  const handleAddPermission = permissionForm.handleSubmit((data) => {
    const workspace = workspaceRequest.workspace!;
    const memberAddress = memberForm.getValues('address');
    const member = workspace.members.find(
      (member) => member.address === memberAddress,
    );
    const permission = data.permission as PermissionRoles;

    if (!member) return;

    permissionsRequest.mutate(
      {
        member: member.id,
        permissions: defaultPermissions[permission],
      },
      {
        onSuccess: () => tabs.set(MemberTabState.SUCCESS),
      },
    );
  });

  const handleEditPermission = editForm.handleSubmit((data) => {
    const workspace = workspaceRequest.workspace!;
    const member = workspace.members.find(
      (member) => member.id === params.memberId,
    );
    const permission = data.permission as PermissionRoles;

    if (!member) return;

    permissionsRequest.mutate(
      {
        member: member.id,
        permissions: defaultPermissions[permission],
      },
      {
        onSuccess: () => tabs.set(MemberTabState.SUCCESS),
      },
    );
  });

  const handleDeleteMember = () => {
    const workspace = workspaceRequest.workspace!;
    const member = workspace.members.find(
      (member) => member.id === params.memberId,
    );

    if (!member) return;

    deleteRequest.mutate(
      {
        id: workspace.id,
        member: member.id,
      },
      {
        onSuccess: () => handleClose(),
      },
    );
  };

  const clearSteps = () => {
    tabs.set(MemberTabState.ADDRESS);
    memberForm.setValue('address', '');
    permissionForm.setValue('permission', '');
  };

  const formState = {
    [MemberTabState.ADDRESS]: {
      isValid: memberForm.formState.isValid,
      primaryAction: 'Continue',
      secondaryAction: 'Cancel',
      handlePrimaryAction: handleAddMember,
      handleSecondaryAction: handleClose,
      isLoading: memberRequest.isLoading,
    },
    [MemberTabState.PERMISSION]: {
      isValid: permissionForm.formState.isValid || editForm.formState.isValid,
      title: isEditMember ? 'Edit member' : 'Add member',
      primaryAction: isEditMember ? 'Update user' : 'Add member',
      secondaryAction: 'Cancel',
      tertiaryAction: isEditMember ? 'Remove from workspace' : undefined,
      handlePrimaryAction: isEditMember
        ? handleEditPermission
        : handleAddPermission,
      handleSecondaryAction: handleClose,
      handleTertiaryAction: handleDeleteMember,
      isLoading: permissionsRequest.isLoading || deleteRequest.isLoading,
    },
    [MemberTabState.SUCCESS]: {
      isValid: true,
      primaryAction: 'Conclude',
      secondaryAction: 'Add another member',
      handlePrimaryAction: handleClose,
      handleSecondaryAction: clearSteps,
      isLoading: false,
    },
  };

  return {
    tabs,
    params,
    addressBook,
    memberRequest,
    permissionsRequest,
    handleClose,
    form: {
      memberForm,
      permissionForm,
      editForm,
      formState: formState[tabs.tab],
    },
  };
};

export { useChangeMember };
