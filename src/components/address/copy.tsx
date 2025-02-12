import { BoxProps, Flex, TextProps } from '@chakra-ui/react';
import { Address as FuelsAddress, isB256 } from 'fuels';
import { useMemo } from 'react';

import {
  CopyAddressButton,
  CopyAddressButtonProps,
} from '@/components/copyAddressButton';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { Address } from '.';

export interface AddressWithCopyBtnProps extends BoxProps {
  value: string;
  isDeposit?: boolean;
  isSidebarAddress?: boolean;
  textProps?: TextProps;
  copyBtnProps?: Omit<CopyAddressButtonProps, 'aria-label' | 'addressToCopy'>;
  customValue?: string;
  hideCopyButton?: boolean;
}

const AddressWithCopyBtn = ({
  value,
  isDeposit,
  isSidebarAddress,
  textProps,
  copyBtnProps,
  customValue,
  hideCopyButton = false,
  ...rest
}: AddressWithCopyBtnProps) => {
  const {
    screenSizes: { isExtraSmall },
  } = useWorkspaceContext();

  const address = useMemo(() => {
    if (isB256(value)) {
      return FuelsAddress.fromB256(value).toString();
    }

    return value;
  }, [value]);

  return (
    <Flex
      minW={isExtraSmall ? 'inherit' : '105px'}
      ml="auto"
      w="full"
      textAlign={isExtraSmall ? 'start' : 'end'}
      overflow="hidden"
      alignItems="center"
      justifyContent={isSidebarAddress ? 'start' : 'end'}
      gap={3}
      {...rest}
    >
      <Address
        value={address}
        customValue={customValue}
        isDeposit={isDeposit}
        isSidebarAddress={isSidebarAddress}
        {...textProps}
      />

      <CopyAddressButton
        display={hideCopyButton ? 'none' : 'initial'}
        size="xs"
        minW={2}
        aria-label="Copy"
        addressToCopy={address}
        {...copyBtnProps}
      />
    </Flex>
  );
};

export { AddressWithCopyBtn };
