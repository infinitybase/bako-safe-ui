import { useNavigate, useParams } from 'react-router-dom';

import { useTab } from '@/modules/core';

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
    tabs: Object.values(MemberTabState) as number[],
    defaultTab: MemberTabState.ADDRESS,
  });

  const navigate = useNavigate();
  const params = useParams<{ workspaceId: string }>();
  const form = useChangeMemberForm();
  const request = useChangeMemberRequest();

  const handleClose = () => navigate(-1);

  const handleAddMember = form.handleSubmit(console.log);

  return {
    tabs,
    params,
    request,
    handleClose,
    form: {
      ...form,
      handleAddMember,
    },
  };
};

export { useChangeMember };
