import { useCallback, useEffect } from 'react';

import { useSocket } from '@/modules/core/hooks/socket';
import { Pages } from '@/modules/core/routes';

import { useQueryParams } from '../usePopup';
import { ISignInRedirect } from './types';

export type UseDappSignIn = ReturnType<typeof useDappSignIn>;

const useDappSignIn = (): ISignInRedirect => {
  const { location, sessionId } = useQueryParams();
  const { connect } = useSocket();

  const redirect = useCallback(() => {
    const isRedirectToPrevious = !!location.state?.from;

    if (isRedirectToPrevious) {
      return location.state.from;
    }

    return `${Pages.dappAuth()}${location.search}`;
  }, [location]);

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
    redirect,
  };
};

export { useDappSignIn };
