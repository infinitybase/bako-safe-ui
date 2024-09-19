import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Icon,
  IconButton,
  IconButtonProps,
  useClipboard,
} from '@chakra-ui/react';

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
      bgColor="none"
      icon={
        <Icon
          as={clipboard.hasCopied ? CheckIcon : CopyIcon}
          color={clipboard.hasCopied ? 'success.700' : 'grey.200'}
          fontSize={16}
        />
      }
      onClick={clipboard.onCopy}
    />
  );
};

export { CopyAddressButton };
