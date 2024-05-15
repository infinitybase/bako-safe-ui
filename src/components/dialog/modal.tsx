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

import { CloseIcon } from '../icons/close-icon';

export interface DialogModalProps extends ModalProps {
  hideCloseButton?: boolean;
  closeButtonMarginTop?: { base: number; xs: number | string };
}

const DialogModal = (props: DialogModalProps) => {
  const { children, ...rest } = props;

  const hideCloseButton = props?.hideCloseButton ?? false;

  return (
    <Modal
      variant="glassmorphic"
      size={{ base: 'full', xs: '2xl' }}
      blockScrollOnMount={false}
      isCentered
      {...rest}
    >
      <ModalOverlay />
      <ModalContent rounded="3xl" bg="dark.950">
        {!hideCloseButton && (
          <Flex
            w="full"
            align="center"
            justifyContent="flex-end"
            mt={props.closeButtonMarginTop}
          >
            <HStack
              onClick={props.onClose}
              cursor="pointer"
              spacing={2}
              zIndex={1}
            >
              <Text fontWeight="normal" color="white">
                Close
              </Text>
              <CloseIcon />
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
