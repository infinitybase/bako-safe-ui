import { CopyIcon } from '@chakra-ui/icons';
import {
  Icon,
  IconButton,
  IconButtonProps,
  useClipboard,
} from '@chakra-ui/react';
import { IoIosCheckmark } from 'react-icons/io';

export interface CopyAddressButtonProps extends IconButtonProps {
  addressToCopy: string;
}

const CopyAddressButton = ({
  addressToCopy,
  ...rest
}: CopyAddressButtonProps) => {
  const clipboard = useClipboard(addressToCopy);
  return (
    <IconButton
      {...rest}
      variant="icon"
      background={{ base: 'dark.950', md: 'none' }}
      icon={
        <Icon
          as={clipboard.hasCopied ? IoIosCheckmark : CopyIcon}
          color={clipboard.hasCopied ? 'success.700' : 'grey.200'}
          fontSize={clipboard.hasCopied ? 30 : 16}
        />
      }
      onClick={clipboard.onCopy}
    />
  );
};

export { CopyAddressButton };
