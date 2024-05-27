import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';

export interface DialogModalProps extends ModalProps {
  contentPadding?: number;
  hideContentOverflow?: boolean;
}

const DialogModal = (props: DialogModalProps) => {
  const { children, blockScrollOnMount, ...rest } = props;

  return (
    <Modal
      variant="glassmorphic"
      size={{ base: 'full', xs: '2xl' }}
      blockScrollOnMount={blockScrollOnMount ?? false}
      isCentered
      {...rest}
    >
      <ModalOverlay />
      <ModalContent
        rounded="3xl"
        bg="dark.950"
        h={{ base: '100vh', sm: 'unset' }}
        p={props.contentPadding}
        overflow={props.hideContentOverflow ? 'hidden' : 'unset'}
      >
        <ModalBody
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
