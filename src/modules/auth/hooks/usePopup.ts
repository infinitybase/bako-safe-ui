import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useQueryParams = () => {
  const location = useLocation();

  const queryParams = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('sessionId');
    const expiredSession = searchParams.get('expired') === 'true';
    const address = searchParams.get('address');
    const isNew = searchParams.get('new');
    const name = searchParams.get('name');
    const origin = searchParams.get('origin');
    const currentVault = searchParams.get('currentVault');
    const openConnect = searchParams.get('openConnect') === 'true';
    const request_id = searchParams.get('request_id');
    const byConnector = searchParams.get('byConnector') === 'true';
    const byLanding = searchParams.get('_gl');
    const username = searchParams.get('username');
    const connectorType = searchParams.get('connector_type');

    return {
      expiredSession,
      sessionId,
      address,
      isNew,
      name,
      origin,
      currentVault,
      openConnect,
      request_id,
      byConnector,
      byLanding,
      username,
      connectorType,
    };
  }, [location]);

  return { ...queryParams, location };
};

export { useQueryParams };
