import { localStorageKeys } from '../../utils';

const useWebAuthnLastLogin = () => {
  const setLastLoginUsername = (id: string) => {
    localStorage.setItem(localStorageKeys.WEB_AUTHN_LAST_LOGIN_USERNAME, id);
  };

  const lastLoginUsername = localStorage.getItem(
    localStorageKeys.WEB_AUTHN_LAST_LOGIN_USERNAME,
  );

  return {
    lastLoginUsername,
    setLastLoginUsername,
  };
};

export { useWebAuthnLastLogin };