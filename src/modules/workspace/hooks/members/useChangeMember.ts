import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAddressBook } from '@/modules/addressBook';
import {
  defaultPermissions,
  EnumUtils,
  Member,
  Pages,
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
import { Address } from 'fuels';

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
  const navigate = useNavigate();

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

  const memberPermission = WorkspacePermissionUtils.getPermissionInWorkspace(
    workspaceRequest.workspace!,
    {
      id: params.memberId,
    } as Member,
  );

  const permissions =
    memberPermission?.role &&
    WorkspacePermissionUtils.permissions[memberPermission.role];

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
    const memberAddress = memberForm.getValues('address.value');
    const _memberAddress = Address.fromString(memberAddress).bech32Address;
    const updatedMemberPermission = editForm.getValues('permission');
    const permission = data.permission as PermissionRoles;

    // If not has an updated member permission and has a memberAddress it means that comes from the memberForm(creation)
    if (!updatedMemberPermission && _memberAddress) {
      memberRequest.mutate(_memberAddress, {
        onSettled: (data?: Workspace) => {
          workspaceRequest.refetch().then(() => {
            const newMember = data?.members.find(
              (member) => member.address === _memberAddress,
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

    // If not has an updated member permission or not has a member it means that comes from the editForm
    if (!updatedMemberPermission || !member) return;

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
    memberForm.reset();
    permissionForm.reset();

    if (isEditMember) {
      editForm.reset();
      redirectToAddMember();
    }
  };

  const clearTabs = () => {
    tabs.set(MemberTabState.FORM);
  };

  const redirectToAddMember = () => {
    navigate(
      Pages.membersWorkspace({
        workspaceId: params.workspaceId ?? '',
      }),
    );
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
      primaryAction: isEditMember ? 'Update' : 'Add member',
      secondaryAction: 'Cancel',
      handlePrimaryAction: isEditMember
        ? handleSetUpdateStep
        : handlePermissions,
      handleSecondaryAction: handleClose,
      isLoading: permissionsRequest.isLoading || deleteRequest.isLoading,
      title: isEditMember ? 'Member permission' : 'User permission',
      description: undefined,
      tertiaryAction: isEditMember ? 'Remove' : undefined,
      handleTertiaryAction: handleSetDeleteStep,
      oldPermission: undefined,
      newPermission: undefined,
      isEditMember,
    },
    [MemberTabState.SUCCESS]: {
      isValid: true,
      primaryAction: 'Go to my workspace',
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
      primaryAction: 'Update member',
      secondaryAction: 'Cancel',
      handlePrimaryAction: handlePermissions,
      handleSecondaryAction: clearTabs,
      isLoading: false,
      title: 'Update member',
      description: undefined,
      tertiaryAction: undefined,
      handleTertiaryAction: undefined,
      oldPermission: memberPermissions?.oldPermission,
      newPermission: memberPermissions?.newPermission,
      isEditMember,
    },
    [MemberTabState.DELETE]: {
      isValid: true,
      primaryAction: 'Remove member',
      secondaryAction: 'Cancel',
      handlePrimaryAction: handleDeleteMember,
      handleSecondaryAction: clearTabs,
      isLoading: false,
      title: 'Remove member',
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
    isEditMember,
    dialog: {
      title: isEditMember ? 'Edit member' : 'Add member',
      description: isEditMember
        ? 'You are editing the role for this member:'
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
