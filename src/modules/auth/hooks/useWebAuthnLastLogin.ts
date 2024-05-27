import { localStorageKeys } from '../services';
import { useGetUserByWebAuthnId } from './useWebauthnRequests';

const useWebAuthnLastLogin = () => {
  const setLastLoginId = (id: string) => {
    localStorage.setItem(localStorageKeys.WEB_AUTHN_LAST_LOGIN_ID, id);
  };

  const lastLoginId = localStorage.getItem(
    localStorageKeys.WEB_AUTHN_LAST_LOGIN_ID,
  );

  const lastLoginUserRequest = useGetUserByWebAuthnId(lastLoginId ?? '');

  return {
    lastLoginId,
    setLastLoginId,
    lastLoginUsername: lastLoginUserRequest.data?.name,
  };
};

export { useWebAuthnLastLogin };
