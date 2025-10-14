import { IconButton, IconButtonProps } from 'bako-ui';
import { forwardRef } from 'react';

import { OptionsIcon } from '@/components/icons';
import { useScreenSize } from '@/modules/core/hooks';

type AddressActionsButtonProps = Omit<
  IconButtonProps,
  'children' | 'aria-label'
>;

const AddressActionsButton = forwardRef<
  HTMLButtonElement,
  AddressActionsButtonProps
>((props, ref) => {
  const { isMobile } = useScreenSize();

  return (
    <IconButton
      ref={ref}
      aria-label="Address actions"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgColor={isMobile ? 'transparent' : 'grey.825'}
      borderRadius={6}
      borderWidth={isMobile ? 0 : 1}
      borderColor="grey.950"
      p={isMobile ? 0 : 1}
      size={isMobile ? '2xs' : 'sm'}
      _hover={{ bgColor: 'dark.950' }}
      {...props}
    >
      <OptionsIcon color="grey.75" fontSize="xl" />
    </IconButton>
  );
});

AddressActionsButton.displayName = 'AddressActionsButton';

export { AddressActionsButton };
