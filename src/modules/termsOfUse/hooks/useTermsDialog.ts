import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useVerifyBrowserType } from '@/modules/dapp/hooks';

export interface UseTermsDialogProps {
  onClose: () => void;
}

const useTermsDialog = (props: UseTermsDialogProps) => {
  const [read, setRead] = useState(false);
  const inView = useInView();
  const { isSafariBrowser, isMobile } = useVerifyBrowserType();

  const handleCancel = () => {
    setRead(false);
    props.onClose();
  };

  useEffect(() => {
    setRead(inView.inView);
  }, [inView.inView]);

  return {
    read,
    setRead,
    inView,
    isSafariBrowser,
    isMobile,
    handleCancel,
  };
};

export { useTermsDialog };
