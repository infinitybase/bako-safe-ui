import { localStorageKeys } from '../services';

const useWebAuthnLastLoginId = () => {
  const setLastLoginId = (id: string) => {
    localStorage.setItem(localStorageKeys.WEB_AUTHN_LAST_LOGIN_ID, id);
  };

  const lastLoginId = localStorage.getItem(
    localStorageKeys.WEB_AUTHN_LAST_LOGIN_ID,
  );

  return {
    lastLoginId,
    setLastLoginId,
  };
};

export { useWebAuthnLastLoginId };
