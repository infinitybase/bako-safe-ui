import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { queryClient } from '@/config';
import { Pages, useAuthCookies, useQueryParams } from '@/modules';
import { GifLoadingRequestQueryKey } from '@/modules/workspace/hooks/useGifLoadingRequest';

const useRedirectAuthUser = () => {
  const [syncingAuth, setSyncingAuth] = useState(true);

  const navigate = useNavigate();
  const { userAuthCookiesInfo } = useAuthCookies();
  const { sessionId: isFromDapp, location } = useQueryParams();

  const redirectAuthUser = useCallback(() => {
    const { account, accessToken } = userAuthCookiesInfo();
    const isAuthenticated = account && accessToken;

    if (isAuthenticated && isFromDapp) {
      navigate(`${Pages.dappAuth()}${location.search}`);
    } else if (isAuthenticated) {
      queryClient.invalidateQueries({
        queryKey: [GifLoadingRequestQueryKey.ANIMATION_LOADING],
      });
      navigate(Pages.home());
    }

    setSyncingAuth(false);
  }, [userAuthCookiesInfo, isFromDapp]);

  useEffect(() => {
    redirectAuthUser();
    window.addEventListener('focus', redirectAuthUser);

    return () => {
      window.removeEventListener('focus', redirectAuthUser);
    };
  }, [redirectAuthUser]);

  return {
    syncingAuth,
  };
};

export { useRedirectAuthUser };
