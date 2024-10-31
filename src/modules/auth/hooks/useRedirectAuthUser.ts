import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthCookies, useQueryParams } from '@/modules';
import { Pages } from '@/modules/core/routes';
import { useVerifyBrowserType } from '@/modules/dapp/hooks';

const useRedirectAuthUser = () => {
  const [syncingAuth, setSyncingAuth] = useState(true);

  const navigate = useNavigate();
  const { userAuthCookiesInfo } = useAuthCookies();
  const { isSafariBrowser } = useVerifyBrowserType();
  const { sessionId: isFromDapp, location, byConnector } = useQueryParams();

  const redirectAuthUser = useCallback(() => {
    if (byConnector && isSafariBrowser) {
      setSyncingAuth(false);
      return;
    }

    const { account, accessToken } = userAuthCookiesInfo();
    const isAuthenticated = account && accessToken;

    if (isAuthenticated && isFromDapp) {
      console.log(`🚀 ~ isAuthenticated && isFromDapp)`);

      navigate(`${Pages.dappAuth()}${location.search}`);
    } else if (isAuthenticated) {
      // queryClient.invalidateQueries({
      //   queryKey: [GifLoadingRequestQueryKey.ANIMATION_LOADING],
      // });
      console.log(`🚀 ~ navigate(Pages.home());`);
      // navigate(Pages.home());
    }

    setSyncingAuth(false);
  }, [userAuthCookiesInfo, isFromDapp, byConnector]);

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
