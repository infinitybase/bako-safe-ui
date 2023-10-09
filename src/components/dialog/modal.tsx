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
import React from 'react';

import { ErrorIcon } from '../icons';

interface DialogModalProps extends ModalProps {}

const DialogModal = (props: DialogModalProps) => {
  const { children, ...rest } = props;

  return (
    <Modal variant="glassmorphic" size="2xl" isCentered {...rest}>
      <ModalOverlay />
      <ModalContent>
        <Flex mb={10} w="full" justifyContent="flex-end">
          <HStack onClick={props.onClose} cursor="pointer" spacing={2}>
            <ErrorIcon />
            <Text fontWeight="semibold" color="white">
              Close
            </Text>
          </HStack>
        </Flex>
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
