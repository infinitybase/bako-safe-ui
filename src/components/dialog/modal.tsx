import {
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalContent,
  ModalContentProps,
  ModalOverlay,
  ModalOverlayProps,
  ModalProps,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export interface DialogModalProps extends ModalProps {
  contentPadding?: number;
  modalContentProps?: ModalContentProps;
  modalBodyProps?: ModalBodyProps;
  xsBreakPointPy?: number;
  overlayProps?: ModalOverlayProps;
}

const DialogModal = (props: DialogModalProps) => {
  const { children, ...rest } = props;
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  return (
    <Modal
      variant="glassmorphic"
      size={{ base: 'full', xs: 'xl' }}
      blockScrollOnMount={true}
      isCentered
      scrollBehavior={isMobile ? 'inside' : 'outside'}
      {...rest}
    >
      <ModalOverlay {...props.overlayProps} />

      <ModalContent
        rounded="3xl"
        bg="dark.950"
        py={{ base: 2, xs: props.xsBreakPointPy ?? 8 }}
        motionProps={{
          initial: { opacity: 0, scale: 0.85 },
          animate: { opacity: 1, scale: 0.9 },
          exit: { opacity: 0, scale: 0.85 },
          transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
        }}
        {...props.modalContentProps}
      >
        <ModalBody
          overflowY="auto"
          zIndex={400}
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
              width: '5px',
              maxHeight: '330px',
              backgroundColor: 'transparent',
              borderRadius: '30px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#2C2C2C',
              borderRadius: '30px',
              height: '10px',
            },
          }}
          w="full"
          display="flex"
          alignItems="center"
          flexDirection="column"
          {...rest.modalBodyProps}
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { DialogModal };
