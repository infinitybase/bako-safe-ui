import { Modal, type ModalProps } from '@chakra-ui/react';

export const Root = ({ isOpen, onClose, children, ...rest }: ModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      variant="glassmorphic"
      size={{
        base: 'full',
        sm: '5xl',
      }}
      blockScrollOnMount
      autoFocus={false}
      {...rest}
    >
      {children}
    </Modal>
  );
};
