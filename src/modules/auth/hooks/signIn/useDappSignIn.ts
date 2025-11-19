import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages } from '@/modules/core/routes';
import {
  ActionKeys,
  handleActionUsingKeys,
} from '@/utils/handle-action-using-keys';

import { useQueryParams } from '../usePopup';
import { useWebAuthnLastLogin } from '../webAuthn';
import { useSocialSignIn } from './useSocialSignIn';
import { useWalletSignIn } from './useWalletSignIn';
import { useWebAuthnSignIn, WebAuthnModeState } from './useWebAuthnSignIn';

export type UseDappSignIn = ReturnType<typeof useDappSignIn>;

const useDappSignIn = () => {
  const isMounted = useRef(false);

  const navigate = useNavigate();
  const { location, byConnector, username } = useQueryParams();

  const redirect = useCallback(() => {
    const isRedirectToPrevious = !!location.state?.from;

    if (isRedirectToPrevious) {
      navigate(location.state.from);
      return;
    }

    navigate(`${Pages.dappAuth()}${location.search}`);
  }, [location]);

  const walletSignIn = useWalletSignIn(redirect);
  const {
    formData,
    fullFormState,
    isSigningIn,
    mode,
    setMode,
    handleLogin,
    isRegistering,
    ...rest
  } = useWebAuthnSignIn(redirect);
  const { lastLoginUsername } = useWebAuthnLastLogin();
  const socialSignIn = useSocialSignIn(redirect);

  const handleLoginOnSafariBrowser = useCallback(() => {
    const username = formData.form.getValues('username');

    window.open(
      `${window.origin}/${window.location.search}&username=${username}`,
      '_blank',
    );
  }, [formData.form]);

  const customHandleLogin =
    byConnector && !username ? handleLoginOnSafariBrowser : handleLogin;

  const customFormState = {
    ...fullFormState,
    [WebAuthnModeState.LOGIN]: {
      ...fullFormState[WebAuthnModeState.LOGIN],
      handleAction: customHandleLogin,
      handleActionUsingEnterKey: (pressedKey: string) =>
        handleActionUsingKeys({
          pressedKey,
          allowedKeys: [ActionKeys.Enter],
          action: customHandleLogin,
          enabled: !fullFormState[WebAuthnModeState.LOGIN].isDisabled,
        }),
    },
    [WebAuthnModeState.ACCOUNT_CREATED]: {
      ...fullFormState[WebAuthnModeState.ACCOUNT_CREATED],
      handleAction: customHandleLogin,
    },
  };

  useEffect(() => {
    if (isMounted.current) {
      if (username && !isSigningIn) {
        formData.form.setValue('username', username, {
          shouldValidate: true,
        });
        setMode(WebAuthnModeState.LOGIN);
        handleLogin();
      } else if (lastLoginUsername && !username) {
        formData.form.setValue('username', lastLoginUsername, {
          shouldValidate: true,
        });
        setMode(WebAuthnModeState.LOGIN);
      }
    }
    isMounted.current = true;
  }, []);

  return {
    ...walletSignIn,
    ...rest,
    ...socialSignIn,
    formData,
    formState: customFormState[mode],
    mode,
    setMode,
    isRegistering,
  };
};

export { useDappSignIn };
