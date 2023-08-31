import { useNavigate } from 'react-router-dom';

import { useFuelAccount } from '@/modules';
import { useUserVaultRequest } from '@/modules/vault';

const useHome = () => {
  const navigate = useNavigate();
  const { account } = useFuelAccount();
  const request = useUserVaultRequest(account);

  return {
    account,
    request: {
      ...request,
      predicates: request.data,
    },
    navigate,
  };
};

export { useHome };
