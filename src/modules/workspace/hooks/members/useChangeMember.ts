import { useNavigate, useParams } from 'react-router-dom';

import { EnumUtils, useTab } from '@/modules/core';

import { useGetWorkspaceRequest } from '../useGetWorkspaceRequest';
import { useChangeMemberForm } from './useChangeMemberForm';
import {
  useChangeMemberRequest,
  useChangePermissionsRequest,
} from './useChangeMemberRequest';

export enum MemberTabState {
  ADDRESS = 0,
  PERMISSION = 1,
  SUCCESS = 2,
}

export type UseChangeMember = ReturnType<typeof useChangeMember>;

const useChangeMember = () => {
  const navigate = useNavigate();
  const params = useParams<{ workspaceId: string }>();

  const tabs = useTab<MemberTabState>({
    tabs: EnumUtils.toNumberArray(MemberTabState),
    defaultTab: MemberTabState.ADDRESS,
  });
  const { memberForm, permissionForm } = useChangeMemberForm();

  const workspaceRequest = useGetWorkspaceRequest(params.workspaceId!);
  const memberRequest = useChangeMemberRequest(params.workspaceId!);
  const permissionsRequest = useChangePermissionsRequest(params.workspaceId!);

  const handleClose = () => navigate(-1);

  const handleAddMember = memberForm.handleSubmit((data) => {
    const workspace = workspaceRequest.workspace!;
    const members = workspace.members.map((member) => member.address) ?? [];

    memberRequest.mutate([...members, data.address], {
      onSuccess: () => tabs.set(MemberTabState.PERMISSION),
    });
  });

  const handleAddPermission = permissionForm.handleSubmit((data) => {
    console.log({ permission: data });
    tabs.set(MemberTabState.SUCCESS);
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
