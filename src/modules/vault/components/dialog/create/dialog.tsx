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

import { ErrorIcon } from '@/components';

interface VaultDialogProps extends ModalProps {}

const Dialog = (props: VaultDialogProps) => {
  const { children, ...rest } = props;

  return (
    <Modal variant="glassmorphic" size="2xl" isCentered {...rest}>
      <ModalOverlay />
      <ModalContent>
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack cursor="pointer" spacing={2}>
            <ErrorIcon />
            <Text fontWeight="semibold" color="white">
              Close
            </Text>
          </HStack>
        </Flex>
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          py={20}
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { Dialog };
