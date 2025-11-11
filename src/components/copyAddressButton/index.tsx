import {
  Icon,
  IconButton,
  IconButtonProps,
  IconProps,
  useClipboard,
} from 'bako-ui';
import { FiCheck as CheckIcon } from 'react-icons/fi';

import { CopyTopMenuIcon } from '../icons/copy-top-menu';

export interface CopyAddressButtonProps extends IconButtonProps {
  addressToCopy: string;
  iconProps?: Omit<IconProps, 'as'>;
}

const CopyAddressButton = ({
  addressToCopy,
  iconProps,
  ...rest
}: CopyAddressButtonProps) => {
  const clipboard = useClipboard({ value: addressToCopy });
  return (
    <IconButton
      {...rest}
      variant="ghost"
      bgColor="none"
      fontSize="xs"
      onClick={clipboard.copy}
    >
      <Icon
        as={clipboard.copied ? CheckIcon : CopyTopMenuIcon}
        color={clipboard.copied ? 'success.700' : 'grey.200'}
        fontSize={rest.fontSize || 20}
        {...iconProps}
      />
    </IconButton>
  );
};

export { CopyAddressButton };
