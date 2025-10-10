import { FiPaperclip as AttachmentIcon } from 'react-icons/fi';
import { Button } from '@chakra-ui/react';

type ActionButtonProps = {
  isLoading: boolean;
  onClick: () => void;
};

const ActionButton = ({ onClick, isLoading }: ActionButtonProps) => {
  return (
    <Button
      size={{
        base: 'md',
        sm: 'lg',
      }}
      color="dark.500"
      fontWeight="bold"
      variant="solid"
      backgroundColor="brand.500"
      colorScheme="brand"
      backgroundSize="200% 100%"
      backgroundPosition="100% 0"
      transition="background-position .5s"
      _hover={{
        transform: 'scale(1.05)',
        transition: 'ease-in-out .3s',
      }}
      loadingText="Connecting.."
      isLoading={isLoading}
      onClick={onClick}
      leftIcon={<AttachmentIcon />}
    >
      Connect Wallet
    </Button>
  );
};

export { ActionButton };
