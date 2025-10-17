import { IconButton, IconButtonProps } from 'bako-ui';
import { forwardRef } from 'react';

import { OptionsIcon } from '@/components/icons';

type AddressActionsButtonProps = Omit<
  IconButtonProps,
  'children' | 'aria-label'
>;

const AddressActionsButton = forwardRef<
  HTMLButtonElement,
  AddressActionsButtonProps
>((props, ref) => {
  return (
    <IconButton
      ref={ref}
      aria-label="Address actions"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius={6}
      variant="ghost"
      _hover={{ bg: 'gray.550' }}
      _expanded={{ bg: 'gray.550' }}
      size={{ base: '2xs', sm: 'xs' }}
      {...props}
    >
      <OptionsIcon color="gray.200" boxSize="20px" />
    </IconButton>
  );
});

AddressActionsButton.displayName = 'AddressActionsButton';

export { AddressActionsButton };
