import { AttachmentIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';

type ActionButtonProps = {
  byConnector: boolean;
  isLoading: boolean;
  onClick: () => void;
};

const ActionButton = ({
  byConnector,
  isLoading,
  onClick,
}: ActionButtonProps) => {
  const formattedButton = (
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
      isLoading={!byConnector ? isLoading : false}
      onClick={!byConnector ? onClick : () => {}}
      leftIcon={<AttachmentIcon />}
    >
      Connect Wallet
    </Button>
  );

  if (byConnector) {
    return (
      <a href="/login" target="_blank">
        {formattedButton}
      </a>
    );
  }
  return <>{formattedButton}</>;
};

export { ActionButton };
