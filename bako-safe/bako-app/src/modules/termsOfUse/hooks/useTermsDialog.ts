import { useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useVerifyBrowserType } from '@/modules/core';

import { useTermsStore } from '../store/useTermsStore';

const useTermsDialog = () => {
  const [read, setRead] = useState(false);
  const inView = useInView();
  const { isSafariBrowser, isMobile } = useVerifyBrowserType();
  const { setModalIsOpen, modalIsOpen } = useTermsStore();
  const { onClose } = useDisclosure();

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
  };
};

export { useTermsDialog };
