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

  const handleAddMember = form.handleSubmit((data) => {
    console.log({ data });
    tabs.set(MemberTabState.SUCCESS);
  });

  const formState = {
    [MemberTabState.ADDRESS]: {
      isValid: !!form.watch('address'),
      handleSubmit: () => tabs.set(MemberTabState.PERMISSION),
    },
    [MemberTabState.PERMISSION]: {
      isValid: !!form.watch('permission'),
      handleSubmit: () => handleAddMember,
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
