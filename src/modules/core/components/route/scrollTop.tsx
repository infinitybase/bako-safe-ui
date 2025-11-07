import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useWorkspaceContext } from '@/modules/workspace/hooks';

const ScrollTop = () => {
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();
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
