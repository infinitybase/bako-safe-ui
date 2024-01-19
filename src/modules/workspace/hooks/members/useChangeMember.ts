import { useNavigate, useParams } from 'react-router-dom';

import { useChangeMemberForm } from './useChangeMemberForm';
import { useChangeMemberRequest } from './useChangeMemberRequest';

export type UseChangeMember = ReturnType<typeof useChangeMember>;

const useChangeMember = () => {
  const navigate = useNavigate();
  const params = useParams<{ workspaceId: string }>();
  const form = useChangeMemberForm();
  const request = useChangeMemberRequest();

  const handleClose = () => navigate(-1);

  const handleAddMember = form.handleSubmit(console.log);

  return {
    form: {
      ...form,
      handleAddMember,
    },
    request,
    params,
    handleClose,
  };
};

export { useChangeMember };
