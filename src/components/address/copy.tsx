import { Flex, FlexProps, TextProps } from 'bako-ui';
import { AddressUtils as BakoAddressUtils } from 'bakosafe';
import { Address as FuelsAddress, isB256 } from 'fuels';
import { useMemo } from 'react';

import {
  CopyAddressButton,
  CopyAddressButtonProps,
} from '@/components/copyAddressButton';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { Address } from '.';

export interface AddressWithCopyBtnProps extends FlexProps {
  value: string;
  isDeposit?: boolean;
  isSidebarAddress?: boolean;
  textProps?: TextProps;
  copyBtnProps?: Omit<CopyAddressButtonProps, 'aria-label' | 'addressToCopy'>;
  customValue?: string;
  hideCopyButton?: boolean;
  isDetailDialog?: boolean;
}

const AddressWithCopyBtn = ({
  value,
  isDeposit,
  isSidebarAddress,
  textProps,
  copyBtnProps,
  customValue,
  hideCopyButton = false,
  isDetailDialog = false,
  ...rest
}: AddressWithCopyBtnProps) => {
  const {
    screenSizes: { isExtraSmall },
  } = useWorkspaceContext();

  const ariaLabel = rest['aria-label'] || 'Copy';

  const address = useMemo(() => {
    if (BakoAddressUtils.isEvm(value)) {
      return BakoAddressUtils.parseFuelAddressToEth(value);
    }

    if (isB256(value)) {
      return FuelsAddress.fromB256(value).toString();
    }

    return value;
  }, [value]);

  const addressToCopy = () => {
    if (BakoAddressUtils.isEvm(value)) {
      return 'eth:' + BakoAddressUtils.parseFuelAddressToEth(value);
    }

    return address;
  };

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
      aria-label={undefined}
    >
      <Address
        value={address}
        customValue={customValue}
        isDeposit={isDeposit}
        isSidebarAddress={isSidebarAddress}
        isDetailDialog={isDetailDialog}
        {...textProps}
      />

      <CopyAddressButton
        display={hideCopyButton ? 'none' : 'initial'}
        size="xs"
        minW={2}
        aria-label={ariaLabel}
        addressToCopy={addressToCopy()}
        {...copyBtnProps}
      />
    </Flex>
  );
};

export { AddressWithCopyBtn };
