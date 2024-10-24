import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages } from '@/modules/core/routes';

import { useQueryParams } from './usePopup';

const useRedirectFromLandingPage = () => {
  const [checkingOrigin, setCheckingOrigin] = useState(true);

  const { byLanding } = useQueryParams();
  const navigate = useNavigate();

  const handleRedirectFromLandingPage = useCallback(() => {
    if (byLanding) {
      navigate(Pages.index());
    }

    setCheckingOrigin(false);
  }, [byLanding]);

  useEffect(() => {
    handleRedirectFromLandingPage();
  }, []);

  return {
    checkingOrigin,
  };
};

export { useRedirectFromLandingPage };
