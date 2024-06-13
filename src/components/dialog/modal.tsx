import {
  Modal,
  ModalBody,
  ModalContent,
  ModalContentProps,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';

import { useScreenSize } from '@/modules';

export interface DialogModalProps extends ModalProps {
  contentPadding?: number;
  modalContentProps?: ModalContentProps;
}

const DialogModal = (props: DialogModalProps) => {
  const { children, ...rest } = props;
  const { isMobile } = useScreenSize();

  return (
    <Modal
      variant="glassmorphic"
      size={{ base: 'full', xs: 'xl' }}
      blockScrollOnMount={true}
      isCentered
      scrollBehavior={isMobile ? 'inside' : 'outside'}
      {...rest}
    >
      <ModalOverlay />
      <ModalContent
        rounded="3xl"
        bg="dark.950"
        py={{ base: 2, xs: 8 }}
        {...props.modalContentProps}
      >
        <ModalBody
          draggable={false}
          overflowY="auto"
          zIndex={400}
          scrollSnapStop="normal"
          sx={{
            touchAction: 'pan-y',
            '&::-webkit-overflow-scrolling:': 'touch',
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
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { DialogModal };
