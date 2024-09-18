import { useCallback, useEffect } from 'react';

import { useSocket } from '@/modules/core/hooks';
import { Pages } from '@/modules/core/routes';

import { useQueryParams } from '../usePopup';
import { useWalletSignIn } from './useWalletSignIn';
import { useWebAuthnSignIn } from './useWebAuthnSignIn';

export type UseDappSignIn = ReturnType<typeof useDappSignIn>;

const useDappSignIn = () => {
  const { location, sessionId } = useQueryParams();
  const { connect } = useSocket();

  const redirect = useCallback(() => {
    const isRedirectToPrevious = !!location.state?.from;

    if (isRedirectToPrevious) {
      return location.state.from;
    }

    return `${Pages.dappAuth()}${location.search}`;
  }, [location]);

  const walletSignIn = useWalletSignIn(redirect);
  const webAuthnSignIn = useWebAuthnSignIn(redirect);

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
