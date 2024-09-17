import { BoxProps, Flex, Text } from '@chakra-ui/react';
import { Address } from 'fuels';

import { CopyAddressButton } from '@/components/copyAddressButton';
import { AddressUtils, useGetParams } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export interface AddressWithCopyBtnProps extends BoxProps {
  address: string;
  isDeposit?: boolean;
  isSidebarAddress?: boolean;
}

const AddressWithCopyBtn = ({
  address,
  isDeposit,
  isSidebarAddress,
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
      isSmall,
    },
  } = useWorkspaceContext();

  return (
    <Flex
      {...rest}
      minW={isExtraSmall ? 'inherit' : '105px'}
      ml="auto"
      w="full"
      textAlign={isExtraSmall ? 'start' : 'end'}
      overflow="hidden"
      alignItems="center"
    >
      <Text
        color="grey.75"
        textOverflow="ellipsis"
        isTruncated
        fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
        ml={isSidebarAddress ? 0 : 3}
        maxW={
          isSidebarAddress
            ? 'full'
            : isExtraSmall && isDeposit
              ? '48px'
              : isExtraSmall && !isDeposit
                ? '35px'
                : 'inherit'
        }
      >
        {isSidebarAddress
          ? AddressUtils.format(address ?? '', 10)
          : isDeposit
            ? AddressUtils.format(
                address ?? '',
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
            : isExtraSmall
              ? (address ?? '')
              : AddressUtils.format(
                  address ?? '',
                  isLitteSmall
                    ? 4
                    : isLowerThanFourHundredAndThirty
                      ? 10
                      : isSmall
                        ? 7
                        : !isVaultPage && isExtraLarge
                          ? 18
                          : 12,
                )}
      </Text>

      <CopyAddressButton
        ml={isSidebarAddress ? -1 : 2}
        size={isLowerThanFourHundredAndThirty || isSidebarAddress ? 'xs' : 'sm'}
        p={0}
        aria-label="Copy"
        addressToCopy={Address.fromString(address ?? '').toB256()}
      />
    </Flex>
  );
};

export { AddressWithCopyBtn };
