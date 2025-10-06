import { CloseIcon } from '@chakra-ui/icons';
import { IconButton, IconButtonProps } from '@chakra-ui/react';

interface ClearProps extends Omit<IconButtonProps, 'onClick' | 'aria-label'> {
  onClear: () => void;
}

const Clear = ({ onClear, ...rest }: ClearProps) => {
  return (
    <IconButton
      icon={<CloseIcon boxSize={2.5} />}
      size="xs"
      variant="ghost"
      position="absolute"
      top="50%"
      right="0.5rem"
      bg="grey.825"
      padding="0.5rem"
      paddingTop={'20px'}
      paddingBottom={'20px'}
      borderRadius="md"
      _hover={{ bg: 'grey.825' }}
      color={'white'}
      transform="translateY(-50%)"
      zIndex={1}
      onClick={onClear}
      aria-label="Clear"
      {...rest}
    />
  );
};

export default Clear;
