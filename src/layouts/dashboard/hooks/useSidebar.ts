import { useNavigate, useParams } from 'react-router-dom';

import { useVaultDetailsRequest } from '@/modules';

const useSidebar = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const vaultDetailsRequest = useVaultDetailsRequest(params.id!);

  return {
    route: {
      params,
      navigate,
    },
    vaultRequest: vaultDetailsRequest,
  };
};

export { useSidebar };
