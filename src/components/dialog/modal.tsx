import {
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Text,
} from '@chakra-ui/react';

import { ErrorIcon } from '../icons';

export interface DialogModalProps extends ModalProps {
  hideCloseButton?: boolean;
}

const DialogModal = (props: DialogModalProps) => {
  const { children, ...rest } = props;

  const hideCloseButton = props?.hideCloseButton ?? false;

  return (
    <Modal variant="glassmorphic" size="2xl" isCentered {...rest}>
      <ModalOverlay />
      <ModalContent>
        {!hideCloseButton && (
          <Flex mb={10} w="full" justifyContent="flex-end">
            <HStack onClick={props.onClose} cursor="pointer" spacing={2}>
              <ErrorIcon />
              <Text fontWeight="semibold" color="white">
                Close
              </Text>
            </HStack>
          </Flex>
        )}
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
