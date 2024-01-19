import { useChangeMemberForm } from './useChangeMemberForm';
import { useChangeMemberRequest } from './useChangeMemberRequest';

const useChangeMember = () => {
  const form = useChangeMemberForm();
  const request = useChangeMemberRequest();

  return {
    form,
    request,
  };
};

export { useChangeMember };
