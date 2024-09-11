import { Flex, Text } from '@chakra-ui/react';
import { Address } from 'fuels';

import { CopyAddressButton } from '@/components/copyAddressButton';
import { AddressUtils, useGetParams } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export interface AddressWithCopyBtnProps {
  address: string;
  isDeposit?: boolean;
}

const AddressWithCopyBtn = ({
  address,
  isDeposit,
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

  console.log('address:', address);

  return (
    <Flex
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
        ml={3}
        maxW={
          isExtraSmall && isDeposit
            ? '48px'
            : isExtraSmall && !isDeposit
              ? '35px'
              : 'inherit'
        }
      >
        {isDeposit
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
        ml={2}
        size={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
        aria-label="Copy"
        addressToCopy={Address.fromString(address ?? '').toB256()}
      />
    </Flex>
  );
};

export { AddressWithCopyBtn };
