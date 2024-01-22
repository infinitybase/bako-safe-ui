import { useNavigate, useParams } from 'react-router-dom';

import { EnumUtils, useTab } from '@/modules/core';

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
  const tabs = useTab<MemberTabState>({
    tabs: EnumUtils.toNumberArray(MemberTabState),
    defaultTab: MemberTabState.ADDRESS,
  });

  const navigate = useNavigate();
  const params = useParams<{ workspaceId: string }>();
  const { memberForm, permissionForm } = useChangeMemberForm();

  const memberRequest = useChangeMemberRequest();
  const permissionsRequest = useChangePermissionsRequest();

  const handleClose = () => navigate(-1);

  const handleAddMember = memberForm.handleSubmit((data) => {
    console.log({ member: data });
    tabs.set(MemberTabState.PERMISSION);
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
      isValid: !!memberForm.watch('address'),
      primaryAction: 'Continue',
      secondaryAction: 'Cancel',
      handlePrimaryAction: handleAddMember,
      handleSecondaryAction: handleClose,
      isLoading: memberRequest.isLoading,
    },
    [MemberTabState.PERMISSION]: {
      isValid: !!permissionForm.watch('permission'),
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
