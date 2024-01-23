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

  const tabs = useTab<MemberTabState>({
    tabs: EnumUtils.toNumberArray(MemberTabState),
    defaultTab: MemberTabState.ADDRESS,
  });

  const { memberForm, permissionForm } = useChangeMemberForm();
  const addressBook = useAddressBook();

  const memberRequest = useIncludeMemberRequest(params.workspaceId!);
  const workspaceRequest = useGetWorkspaceRequest(params.workspaceId!);
  const permissionsRequest = useChangePermissionsRequest(params.workspaceId!);

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
      isValid: permissionForm.formState.isValid,
      primaryAction: 'Add member',
      secondaryAction: 'Cancel',
      handlePrimaryAction: handleAddPermission,
      handleSecondaryAction: handleClose,
      isLoading: permissionsRequest.isLoading,
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
      formState: formState[tabs.tab],
    },
  };
};

export { useChangeMember };
