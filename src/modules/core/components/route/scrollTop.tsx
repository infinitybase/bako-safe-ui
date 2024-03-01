import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useScreenSize } from '@/modules/core/hooks/useScreenSize';

const ScrollTop = () => {
  const { isMobile } = useScreenSize();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [isMobile, pathname]);

  return null;
};

export { ScrollTop };
