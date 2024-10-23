import { BoxProps, Flex, Text, TextProps } from '@chakra-ui/react';
import { Address } from 'fuels';

import { CopyAddressButton } from '@ui/components';
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
      isExtraSmall,
      isLowerThanFourHundredAndThirty,
      isExtraLarge,
      isLitteSmall,
    },
  } = useWorkspaceContext();

  const b256Address = address ? Address.fromString(address).toB256() : '';

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
      <Text
        color="grey.75"
        textOverflow="ellipsis"
        isTruncated
        fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
        {...addressProps}
        maxW={
          isSidebarAddress
            ? 'full'
            : isExtraSmall && isDeposit
              ? '48px'
              : isExtraSmall && !isDeposit
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
                  isExtraSmall
                    ? 1
                    : isLitteSmall
                      ? 4
                      : isLowerThanFourHundredAndThirty
                        ? 7
                        : !isVaultPage && isExtraLarge
                          ? 24
                          : 10,
                )
              : AddressUtils.format(
                  b256Address ?? '',
                  isLitteSmall ? 4 : isLowerThanFourHundredAndThirty ? 10 : 7,
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
