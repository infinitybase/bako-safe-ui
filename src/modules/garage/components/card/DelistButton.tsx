import { CloseIcon } from '@chakra-ui/icons';
import { IconButton, type IconButtonProps } from '@chakra-ui/react';
import type { MouseEvent } from 'react';

interface DelistButtonProps
  extends Omit<IconButtonProps, 'aria-label' | 'onClick'> {
  onDelist: (e: MouseEvent) => void;
}

export const DelistButton = ({ onDelist, ...props }: DelistButtonProps) => {
  return (
    <IconButton
      onClick={onDelist}
      position="absolute"
      top={2}
      right={2}
      aria-label="Delist NFT"
      size="xs"
      borderRadius="base"
      bgColor="input.600"
      _hover={{
        bgColor: 'input.900',
      }}
      {...props}
    >
      <CloseIcon />
    </IconButton>
  );
};
