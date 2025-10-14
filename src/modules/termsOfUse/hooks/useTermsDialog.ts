import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useVerifyBrowserType } from '@/modules/dapp/hooks';

import { useTermsStore } from '../store/useTermsStore';

const useTermsDialog = () => {
  const [read, setRead] = useState(false);
  const inView = useInView();
  const { isSafariBrowser, isMobile } = useVerifyBrowserType();
  const { setModalIsOpen, modalIsOpen } = useTermsStore();
  const { onClose, onOpenChange } = useDisclosure();

  const handleClose = () => {
    setRead(false);
    setModalIsOpen(false);
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
    handleClose,
    setModalIsOpen,
    modalIsOpen,
    onClose,
    onOpenChange,
  };
};

export { useTermsDialog };
