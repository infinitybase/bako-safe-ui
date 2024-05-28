import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';

import { useScreenSize } from '@/modules';

export interface DialogModalProps extends ModalProps {
  contentPadding?: number;
  hideContentOverflow?: boolean;
}

const DialogModal = (props: DialogModalProps) => {
  const { children, blockScrollOnMount, ...rest } = props;
  const { isMobile } = useScreenSize();

  console.log('blockScrollOnMount', blockScrollOnMount);

  return (
    <Modal
      variant="glassmorphic"
      size={{ base: 'full', xs: '2xl' }}
      // blockScrollOnMount={blockScrollOnMount ?? false}
      blockScrollOnMount={true}
      isCentered
      scrollBehavior={isMobile ? 'inside' : 'outside'}
      {...rest}
    >
      <ModalOverlay />
      <ModalContent
        rounded="3xl"
        bg="dark.950"
        // pr={1}
        // pr={2}
        // h={{ base: '100vh', sm: 'unset' }}
        // overflow={props.hideContentOverflow ? 'hidden' : 'unset'}
      >
        <ModalBody
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
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { DialogModal };
