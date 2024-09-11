import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useAuthUrlParams = () => {
  const location = useLocation();
  const { pathname } = location;

  const sessionId = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('sessionId');
  }, [location]);

  const isTxFromDapp = useMemo(
    () =>
      !sessionId &&
      pathname.includes('dapp') &&
      pathname.includes('transaction'),
    [pathname, sessionId],
  );

  return {
    isTxFromDapp,
  };
};

export { useAuthUrlParams };
