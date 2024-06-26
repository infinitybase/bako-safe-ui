import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useQueryParams = () => {
  const location = useLocation();

  const queryParams = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('sessionId');
    const address = searchParams.get('address');
    const isNew = searchParams.get('new');
    const name = searchParams.get('name');
    const origin = searchParams.get('origin');
    const currentVault = searchParams.get('currentVault');
    const openConnect = searchParams.get('openConnect') === 'true';
    const request_id = searchParams.get('request_id');
    const isOpenWebAuth = searchParams.get('openWebAuth') === 'true';
    const byConnector = searchParams.get('byConnector') === 'true';

    return {
      sessionId,
      address,
      isNew,
      name,
      origin,
      currentVault,
      openConnect,
      request_id,
      isOpenWebAuth,
      byConnector,
    };
  }, [location]);

  return { ...queryParams, location };
};

export { useQueryParams };
