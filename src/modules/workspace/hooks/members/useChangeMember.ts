import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

import { useWorkspaceContext } from '../../hooks';
import { WorkspacePermissionUtils } from '../../utils';
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
  const navigate = useNavigate();
  const {
    workspaceInfos: {
      handlers: { handleWorkspaceSelection },
      currentWorkspaceRequest: {
        currentWorkspace,
        refetch: refetchCurrentWorkspace,
      },
    },
    addressBookInfos,
  } = useWorkspaceContext();

  const { successToast } = useSettingsToast();

  const params = useParams<{ workspaceId: string; memberId: string }>();
  const isEditMember = !!params.memberId;
  const [memberPermissions, setMemberPermissions] =
    useState<MemberPermission>();

  const tabs = useTab<MemberTabState>({
    tabs: EnumUtils.toNumberArray(MemberTabState),
    defaultTab: MemberTabState.FORM,
  });

  const membersToForm = currentWorkspace?.members?.map(
    (member) => member.address,
  );
  const { memberForm, permissionForm, editForm, setMemberValuesByWorkspace } =
    useChangeMemberForm(membersToForm!);

  const memberPermission = WorkspacePermissionUtils.getPermissionInWorkspace(
    currentWorkspace!,
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

  const memberRequest = useIncludeMemberRequest();
  const permissionsRequest = useChangePermissionsRequest();
  const deleteRequest = useDeleteMemberRequest();

  const handleEditMemberPermission = useCallback(
    (workspace: Workspace) => {
      isEditMember && setMemberValuesByWorkspace(workspace, params.memberId);
    },
    [isEditMember, params.memberId, setMemberValuesByWorkspace],
  );

  const handleClose = () =>
    handleWorkspaceSelection(
      params.workspaceId ?? '',
      Pages.workspace({
        workspaceId: params.workspaceId ?? '',
      }),
    );

  const handlePermissions = permissionForm.handleSubmit((data) => {
    const memberAddress = memberForm.getValues('address.value');
    const updatedMemberPermission = editForm.getValues('permission');
    const permission = data.permission as PermissionRoles;

    // If not has an updated member permission and has a memberAddress it means that comes from the memberForm(creation)
    if (!updatedMemberPermission && memberAddress) {
      memberRequest.mutate(memberAddress, {
        onSuccess: (data: Workspace) => {
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
                  refetchCurrentWorkspace();
                },
              },
            );
          }
        },
      });
    }

    const workspace = currentWorkspace!;
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
          refetchCurrentWorkspace();
          successToast({
            title: 'Success!',
            description: 'Your member permissions were updated.',
          });
        },
      },
    );
  });

  const handleDeleteMember = () => {
    const workspace = currentWorkspace!;
    const member = workspace.members.find(
      (member) => member.id === params.memberId,
    );

    if (!member) return;

    deleteRequest.mutate(
      {
        member: member.id,
      },
      {
        onSuccess: () => {
          refetchCurrentWorkspace();
          (handleClose(),
            successToast({
              title: 'Success!',
              description: 'Your member was deleted from this workspace.',
            }));
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

  const isValidToAddMember = useMemo(
    () => permissionForm.formState.isValid && memberForm?.formState?.isValid,
    [
      memberForm.formState.errors,
      memberForm.formState.isValid,
      permissionForm.formState.isValid,
    ],
  );

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
      isValid: isValidToAddMember || editForm.formState.isValid,
      primaryAction: isEditMember ? 'Update' : 'Add member',
      secondaryAction: 'Cancel',
      handlePrimaryAction: isEditMember
        ? handleSetUpdateStep
        : handlePermissions,
      handleSecondaryAction: handleClose,
      isLoading: permissionsRequest.isPending || deleteRequest.isPending,
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

  useEffect(() => {
    handleEditMemberPermission(currentWorkspace!);
  }, []);

  return {
    tabs,
    params,
    addressBook: addressBookInfos,
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
