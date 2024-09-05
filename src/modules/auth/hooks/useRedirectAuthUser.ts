import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  generateRedirectQueryParams,
  useAuthCookies,
  useQueryParams,
} from '@/modules';

const useRedirectAuthUser = () => {
  const [syncingAuth, setSyncingAuth] = useState(true);

  const navigate = useNavigate();
  const { userAuthCookiesInfo } = useAuthCookies();
  const { account, accessToken } = userAuthCookiesInfo();
  const { sessionId, origin, name, request_id } = useQueryParams();

  const isAuthenticated = useMemo(
    () => account && accessToken,
    [account, accessToken],
  );

  useEffect(() => {
    if (isAuthenticated && sessionId) {
      const queryParams = generateRedirectQueryParams({
        sessionId,
        origin,
        name,
        request_id,
      });
      navigate(`/dapp${queryParams}`);
    } else if (isAuthenticated) {
      navigate('/home');
    }

    setSyncingAuth(false);
  }, []);

  return {
    syncingAuth,
  };
};

export { useRedirectAuthUser };
