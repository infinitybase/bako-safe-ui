import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQueryParams, useSocialSignIn } from '@/modules/auth/hooks';
import { Pages } from '@/modules/core';

import { DappSignInContainer } from '../components/signIn';

const DappSocialSignInPage = () => {
  const navigate = useNavigate();
  const { location } = useQueryParams();

  const redirect = useCallback(() => {
    const isRedirectToPrevious = !!location.state?.from;

    if (isRedirectToPrevious) {
      navigate(location.state.from);
      return;
    }

    navigate(`${Pages.dappAuth()}${location.search}`);
  }, [location.search, location.state?.from, navigate]);

  const { unableToConnect, connect } = useSocialSignIn(redirect, true);

  return (
    <DappSignInContainer
      message="Sign in with your Email or Google Account"
      disableConnect={unableToConnect}
      onConnect={connect}
    />
  );
};

export { DappSocialSignInPage };
