import { Icon, IconButton, IconButtonProps } from 'bako-ui';

import { CloseCircle } from '@/components';

interface ClearProps extends Omit<IconButtonProps, 'onClick' | 'aria-label'> {
  onClear: () => void;
}

const Clear = ({ onClear, ...rest }: ClearProps) => {
  return (
    <IconButton
      size="xs"
      variant="ghost"
      position="absolute"
      top="50%"
      right="0.5rem"
      bg="transparent"
      padding="0.5rem"
      paddingTop={'20px'}
      paddingBottom={'20px'}
      borderRadius="md"
      _hover={{ bg: 'transparent' }}
      color={'white'}
      transform="translateY(-50%)"
      zIndex={1}
      onClick={onClear}
      aria-label="Clear"
      {...rest}
    >
      <Icon as={CloseCircle} boxSize={4} />
    </IconButton>
  );
};

export default Clear;
