import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';

export interface DialogModalProps extends ModalProps {}

const DialogModal = (props: DialogModalProps) => {
  const { children, ...rest } = props;

  return (
    <Modal
      variant="glassmorphic"
      size={{ base: 'full', xs: 'xl' }}
      blockScrollOnMount={false}
      isCentered
      {...rest}
    >
      <ModalOverlay />
      <ModalContent rounded="3xl" bg="dark.950">
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
