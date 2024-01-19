import { useChangeMemberForm } from './useChangeMemberForm';

const useChangeMember = () => {
  const form = useChangeMemberForm();

  return {
    form,
  };
};

export { useChangeMember };
