import { BoxProps, Flex, Text } from '@chakra-ui/react';
import { Address } from 'fuels';

import { CopyAddressButton } from '@/components/copyAddressButton';
import { AddressUtils, useGetParams } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export interface AddressWithCopyBtnProps extends BoxProps {
  address: string;
  isDeposit?: boolean;
}

const AddressWithCopyBtn = ({
  address,
  isDeposit,
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

  return (
    <Flex
      minW={isExtraSmall ? 'inherit' : '105px'}
      ml="auto"
      w="full"
      textAlign={isExtraSmall ? 'start' : 'end'}
      overflow="hidden"
      alignItems="center"
      justifyContent="end"
      gap={3}
      {...rest}
    >
      <Text
        color="grey.75"
        textOverflow="ellipsis"
        isTruncated
        fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
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
                isLitteSmall ? 4 : isLowerThanFourHundredAndThirty ? 10 : 7,
              )}
      </Text>

      <CopyAddressButton
        minW={2}
        size="xs"
        aria-label="Copy"
        addressToCopy={Address.fromString(address ?? '').toB256()}
      />
    </Flex>
  );
};

export { AddressWithCopyBtn };
