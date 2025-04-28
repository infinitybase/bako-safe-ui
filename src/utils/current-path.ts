import { useLocation } from 'react-router-dom';

const useCurrentPath = () => {
  const { pathname } = useLocation();

  const isSignInpage = pathname === '/';
  const isFromDapp = pathname.startsWith('/dapp');

  return {
    isSignInpage,
    isFromDapp,
  };
};

export { useCurrentPath };
