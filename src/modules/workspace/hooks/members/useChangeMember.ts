import { useNavigate, useParams } from 'react-router-dom';

import { EnumUtils, useTab } from '@/modules/core';

import { useChangeMemberForm } from './useChangeMemberForm';
import { useChangeMemberRequest } from './useChangeMemberRequest';

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
  const form = useChangeMemberForm();
  const request = useChangeMemberRequest();

  const handleClose = () => navigate(-1);

  const clearSteps = () => {
    tabs.set(MemberTabState.ADDRESS);
    form.reset({
      address: '',
      permission: '',
    });
  };

  const handleAddMember = form.handleSubmit((data) => {
    console.log({ data });
    tabs.set(MemberTabState.SUCCESS);
  });

  const formState = {
    [MemberTabState.ADDRESS]: {
      isValid: !!form.watch('address'),
      primaryAction: 'Continue',
      secondaryAction: 'Cancel',
      handlePrimaryAction: () => tabs.set(MemberTabState.PERMISSION),
      handleSecondaryAction: handleClose,
    },
    [MemberTabState.PERMISSION]: {
      isValid: !!form.watch('permission'),
      primaryAction: 'Add member',
      secondaryAction: 'Cancel',
      handlePrimaryAction: handleAddMember,
      handleSecondaryAction: handleClose,
    },
    [MemberTabState.SUCCESS]: {
      isValid: true,
      primaryAction: 'Conclude',
      secondaryAction: 'Add another member',
      handlePrimaryAction: handleClose,
      handleSecondaryAction: clearSteps,
    },
  };

  return {
    tabs,
    params,
    request,
    handleClose,
    form: {
      ...form,
      formState: formState[tabs.tab],
    },
  };
};

export { useChangeMember };
