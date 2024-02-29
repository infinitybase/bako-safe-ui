import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAddressBook } from '@/modules/addressBook';
import {
  defaultPermissions,
  EnumUtils,
  Member,
  PermissionRoles,
  useTab,
  Workspace,
} from '@/modules/core';
import { useSettingsToast } from '@/modules/settings/hooks/useSettingsToast';

import { WorkspacePermissionUtils } from '../../utils';
import { useGetWorkspaceRequest } from '../useGetWorkspaceRequest';
import { useWorkspace } from '../useWorkspace';
import { useChangeMemberForm } from './useChangeMemberForm';
import {
  useChangePermissionsRequest,
  useDeleteMemberRequest,
  useIncludeMemberRequest,
} from './useChangeMemberRequest';

export enum MemberTabState {
  FORM = 0,
  SUCCESS = 1,
  UPDATE = 2,
  DELETE = 3,
}

interface MemberPermission {
  oldPermission: string;
  newPermission: string;
}

export type UseChangeMember = ReturnType<typeof useChangeMember>;

const useChangeMember = () => {
  const { goWorkspace } = useWorkspace();
  const { successToast } = useSettingsToast();

  const params = useParams<{ workspaceId: string; memberId: string }>();
  const isEditMember = !!params.memberId;
  const [memberPermissions, setMemberPermissions] =
    useState<MemberPermission>();

  const tabs = useTab<MemberTabState>({
    tabs: EnumUtils.toNumberArray(MemberTabState),
    defaultTab: MemberTabState.FORM,
  });

  const workspaceRequest = useGetWorkspaceRequest(params.workspaceId!, {
    onSuccess: (workspace) => {
      if (!isEditMember) return;

      setMemberValuesByWorkspace(workspace, params.memberId);
    },
  });

  const membersToForm = workspaceRequest.workspace?.members.map(
    (member) => member.address,
  );
  const { memberForm, permissionForm, editForm, setMemberValuesByWorkspace } =
    useChangeMemberForm(membersToForm!);
  const addressBook = useAddressBook();

  const role = WorkspacePermissionUtils.getPermissionInWorkspace(
    workspaceRequest.workspace!,
    {
      id: params.memberId,
    } as Member,
  );

  const permissions =
    WorkspacePermissionUtils.permissions[role?.title?.toUpperCase()];

  useMemo(() => {
    setMemberPermissions({
      oldPermission: permissions?.title?.toUpperCase() ?? '',
      newPermission: permissionForm.watch('permission'),
    });
  }, [permissionForm.watch('permission')]);

  const memberRequest = useIncludeMemberRequest(params.workspaceId!);
  const permissionsRequest = useChangePermissionsRequest(params.workspaceId!);
  const deleteRequest = useDeleteMemberRequest(params.workspaceId!);

  const handleClose = () => goWorkspace(params.workspaceId!);

  // const handleAddMember = memberForm.handleSubmit((data) => {
  //   memberRequest.mutate(data.address, {
  //     onSuccess: () => {
  //       tabs.set(MemberTabState.FORM);
  //       workspaceRequest.refetch();
  //     },
  //   });
  // });

  const handlePermissions = permissionForm.handleSubmit((data) => {
    const memberAddress = memberForm.getValues('address');
    const permission = data.permission as PermissionRoles;

    // If has memberAddress it means that comes from the memberForm(creation)
    if (memberAddress) {
      memberRequest.mutate(memberAddress, {
        onSettled: (data?: Workspace) => {
          workspaceRequest.refetch().then(() => {
            const newMember = data?.members.find(
              (member) => member.address === memberAddress,
            );
            if (newMember) {
              permissionsRequest.mutate(
                {
                  member: newMember.id,
                  permissions: defaultPermissions[permission],
                },
                {
                  onSuccess: () => {
                    tabs.set(MemberTabState.SUCCESS);
                    workspaceRequest.refetch();
                  },
                },
              );
            }
          });
        },
      });
    }

    const workspace = workspaceRequest.workspace!;
    const member = workspace.members.find(
      (member) => member.address === memberAddress,
    );
    // If !member and !memberAddress it means that comes from the editForm
    if (!member) return;
    permissionsRequest.mutate(
      {
        member: member.id,
        permissions: defaultPermissions[permission],
      },
      {
        onSuccess: () => {
          tabs.set(MemberTabState.SUCCESS);
          workspaceRequest.refetch();
          successToast({
            title: 'Success!',
            description: 'Your member permissions were updated.',
          });
        },
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
        onSuccess: () => {
          handleClose(),
            successToast({
              title: 'Success!',
              description: 'Your member was deleted from this workspace.',
            });
        },
      },
    );
  };

  const handleSetUpdateStep = () => {
    tabs.set(MemberTabState.UPDATE);
  };

  const handleSetDeleteStep = () => {
    tabs.set(MemberTabState.DELETE);
  };

  const clearSteps = () => {
    tabs.set(MemberTabState.FORM);
    memberForm.setValue('address', '');
    permissionForm.setValue('permission', '');
  };

  const formState = {
    // [MemberTabState.ADDRESS]: {
    //   isValid: memberForm.formState.isValid,
    //   primaryAction: 'Continue',
    //   secondaryAction: 'Cancel',
    //   handlePrimaryAction: handleAddMember,
    //   handleSecondaryAction: handleClose,
    //   isLoading: memberRequest.isLoading,
    //   title: 'Add member',
    //   tertiaryAction: undefined,
    //   handleTertiaryAction: undefined,
    //   isEditMember,
    // },
    [MemberTabState.FORM]: {
      isValid: permissionForm.formState.isValid || editForm.formState.isValid,
      primaryAction: isEditMember ? 'Update user' : 'Add member',
      secondaryAction: 'Cancel',
      handlePrimaryAction: isEditMember
        ? handleSetUpdateStep
        : handlePermissions,
      handleSecondaryAction: handleClose,
      isLoading: permissionsRequest.isLoading || deleteRequest.isLoading,
      title: isEditMember ? 'Edit member' : 'User permission',
      description: undefined,
      tertiaryAction: isEditMember ? 'Remove from workspace' : undefined,
      handleTertiaryAction: handleSetDeleteStep,
      oldPermission: undefined,
      newPermission: undefined,
      isEditMember,
    },
    [MemberTabState.SUCCESS]: {
      isValid: true,
      primaryAction: 'Conclude',
      secondaryAction: 'Add another member',
      handlePrimaryAction: handleClose,
      handleSecondaryAction: clearSteps,
      isLoading: false,
      title: isEditMember ? 'Member updated' : 'Member added',
      description: undefined,
      tertiaryAction: undefined,
      handleTertiaryAction: undefined,
      oldPermission: undefined,
      newPermission: undefined,
      isEditMember,
    },
    [MemberTabState.UPDATE]: {
      isValid: true,
      primaryAction: 'Update user',
      secondaryAction: 'Cancel',
      handlePrimaryAction: handlePermissions,
      handleSecondaryAction: clearSteps,
      isLoading: false,
      title: 'Update user',
      description: undefined,
      tertiaryAction: undefined,
      handleTertiaryAction: undefined,
      oldPermission: memberPermissions?.oldPermission,
      newPermission: memberPermissions?.newPermission,
      isEditMember,
    },
    [MemberTabState.DELETE]: {
      isValid: true,
      primaryAction: 'Remove user',
      secondaryAction: 'Cancel',
      handlePrimaryAction: handleDeleteMember,
      handleSecondaryAction: clearSteps,
      isLoading: false,
      title: 'Remove user',
      description:
        'Are you sure you want to remove this user from this workspace? ',
      tertiaryAction: undefined,
      handleTertiaryAction: undefined,
      oldPermission: undefined,
      newPermission: undefined,
      isEditMember,
    },
  };

  return {
    tabs,
    params,
    addressBook,
    memberRequest,
    permissionsRequest,
    handleClose,
    dialog: {
      title: isEditMember ? 'Edit member' : 'Add member',
      description: isEditMember
        ? 'Manage roles, remove or adjust permissions as needed'
        : 'Add members, manage roles, remove or adjust permissions as needed',
    },
    form: {
      memberForm,
      permissionForm,
      editForm,
      formState: formState[tabs.tab],
    },
  };
};

export { useChangeMember };
