import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages, useAuthCookies, useQueryParams } from '@/modules';

const useRedirectAuthUser = () => {
  const [syncingAuth, setSyncingAuth] = useState(true);

  const navigate = useNavigate();
  const { userAuthCookiesInfo } = useAuthCookies();
  const { account, accessToken } = userAuthCookiesInfo();
  const { sessionId, location } = useQueryParams();

  const isAuthenticated = useMemo(
    () => account && accessToken,
    [account, accessToken],
  );

  useEffect(() => {
    if (isAuthenticated && sessionId) {
      navigate(`${Pages.dappAuth()}${location.search}`);
    } else if (isAuthenticated) {
      navigate(Pages.home());
    }

    setSyncingAuth(false);
  }, []);

  return {
    syncingAuth,
  };
};

export { useRedirectAuthUser };
