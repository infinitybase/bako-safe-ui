import { CheckMarkCircleIcon, CopyTopMenuIcon } from '@bako-safe/ui/components';
import {
  Icon,
  IconButton,
  type IconButtonProps,
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
      fontSize="xs"
      icon={
        <Icon
          as={clipboard.hasCopied ? CheckMarkCircleIcon : CopyTopMenuIcon}
          color={clipboard.hasCopied ? 'success.700' : 'grey.200'}
          fontSize={20}
        />
      }
      onClick={clipboard.onCopy}
    />
  );
};

export { CopyAddressButton };
