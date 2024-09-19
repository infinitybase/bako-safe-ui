import { useCallback, useEffect } from 'react';

import { useSocket } from '@/modules/core/hooks';
import { Pages } from '@/modules/core/routes';

import { useQueryParams } from '../usePopup';
import { useWalletSignIn } from './useWalletSignIn';
import { useWebAuthnSignIn } from './useWebAuthnSignIn';

export type UseDappSignIn = ReturnType<typeof useDappSignIn>;

const useDappSignIn = () => {
  const { location, sessionId, byConnector, username } = useQueryParams();
  const { connect } = useSocket();

  const redirect = useCallback(() => {
    const isRedirectToPrevious = !!location.state?.from;

    if (isRedirectToPrevious) {
      return location.state.from;
    }

    return `${Pages.dappAuth()}${location.search}`;
  }, [location]);

  const handleLoginOnSafariBrowser = useCallback((username: string) => {
    window.open(
      `${window.origin}/${window.location.search}&username=${username}`,
      '_blank',
    );
  }, []);

  const customHandleLogin =
    byConnector && !username ? handleLoginOnSafariBrowser : undefined;

  const walletSignIn = useWalletSignIn(redirect);
  const webAuthnSignIn = useWebAuthnSignIn(redirect, customHandleLogin);

  const getSessionId = useCallback(() => {
    let _sessionId = sessionId;
    if (!_sessionId) {
      _sessionId = crypto.randomUUID();
      window.localStorage.setItem('sessionId', _sessionId);
    }

    return _sessionId;
  }, [sessionId]);

  useEffect(() => {
    connect(getSessionId());
  });

  return {
    ...walletSignIn,
    ...webAuthnSignIn,
  };
};

export { useDappSignIn };
