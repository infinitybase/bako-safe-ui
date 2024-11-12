import { IconButton, IconButtonProps } from '@chakra-ui/react';
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
      aria-label="More info"
      bgColor="grey.825"
      borderRadius={6}
      borderWidth={1}
      borderColor="grey.950"
      p={1}
      size="sm"
      _hover={{ bgColor: 'dark.950' }}
      icon={<OptionsIcon color="grey.75" fontSize="xl" />}
      {...props}
    />
  );
});

AddressActionsButton.displayName = 'AddressActionsButton';

export { AddressActionsButton };
