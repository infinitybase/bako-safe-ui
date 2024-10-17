import { BoxProps, Flex, Text, TextProps } from '@chakra-ui/react';
import { Address } from 'fuels';

import { CopyAddressButton } from '@/components/copyAddressButton';
import { AddressUtils, useGetParams } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export interface AddressWithCopyBtnProps extends BoxProps {
  address: string;
  isDeposit?: boolean;
  isSidebarAddress?: boolean;
  addressProps?: TextProps;
  customAddress?: string;
  hideCopyButton?: boolean;
}

const AddressWithCopyBtn = ({
  address,
  isDeposit,
  isSidebarAddress,
  addressProps,
  customAddress,
  hideCopyButton = false,
  ...rest
}: AddressWithCopyBtnProps) => {
  const {
    vaultPageParams: { vaultId },
  } = useGetParams();
  const isVaultPage = !!vaultId;
  const {
    screenSizes: {
      screenWidths: {
        isLargerThan1360,
        isSmallerThan336,
        isSmallerThan430,
        isSmallerThan400,
      },
    },
  } = useWorkspaceContext();

  const b256Address = address ? Address.fromString(address).toB256() : '';

  return (
    <Flex
      minW={isSmallerThan336 ? 'inherit' : '105px'}
      ml="auto"
      w="full"
      textAlign={isSmallerThan336 ? 'start' : 'end'}
      overflow="hidden"
      alignItems="center"
      justifyContent={isSidebarAddress ? 'start' : 'end'}
      gap={3}
      {...rest}
    >
      <Text
        color="grey.75"
        textOverflow="ellipsis"
        isTruncated
        fontSize={isSmallerThan430 ? 'xs' : 'sm'}
        {...addressProps}
        maxW={
          isSidebarAddress
            ? 'full'
            : isSmallerThan336 && isDeposit
              ? '48px'
              : isSmallerThan336 && !isDeposit
                ? 'inherit'
                : 'inherit'
        }
        {...addressProps}
      >
        {customAddress
          ? customAddress
          : isSidebarAddress
            ? AddressUtils.format(b256Address ?? '', 10)
            : isDeposit
              ? AddressUtils.format(
                  b256Address ?? '',
                  isSmallerThan336
                    ? 1
                    : isSmallerThan400
                      ? 4
                      : isSmallerThan430
                        ? 7
                        : !isVaultPage && isLargerThan1360
                          ? 24
                          : 10,
                )
              : AddressUtils.format(
                  b256Address ?? '',
                  isSmallerThan400 ? 4 : isSmallerThan430 ? 10 : 7,
                )}
      </Text>

      <CopyAddressButton
        display={hideCopyButton ? 'none' : 'initial'}
        size="xs"
        minW={2}
        aria-label="Copy"
        addressToCopy={address && Address.fromString(address).toB256()}
      />
    </Flex>
  );
};

export { AddressWithCopyBtn };
