import { Text, TextProps } from 'bako-ui';
import { AddressUtils as BakoAddressUtils } from 'bakosafe';
import { Address as FuelsAddress } from 'fuels';

import { useGetParams } from '@/modules/core/hooks';
import { AddressUtils } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

export interface AddressProps extends TextProps {
  value: string;
  customValue?: string;
  isDeposit?: boolean;
  isSidebarAddress?: boolean;
  isDetailDialog?: boolean;
}

const Address = (props: AddressProps) => {
  const {
    value,
    isDeposit,
    isSidebarAddress,
    customValue,
    isDetailDialog,
    ...rest
  } = props;

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

  const isPasskey = AddressUtils.isPasskey(value);
  const isSocial = AddressUtils.isSocial(value);
  const isEvm = BakoAddressUtils.isEvm(value);
  const getB256Address = () => {
    if (isEvm) {
      return 'eth:' + value;
    }

    return value && !isPasskey && !isSocial
      ? FuelsAddress.fromString(value).toString()
      : (value ?? '');
  };

  const b256Address = getB256Address();

  return (
    <Text
      color={isDetailDialog ? 'white' : 'grey.75'}
      textOverflow="ellipsis"
      truncate
      textAlign={isExtraSmall ? 'start' : 'end'}
      fontSize="xs"
      maxW={
        isSidebarAddress
          ? 'full'
          : isExtraSmall && isDeposit
            ? '48px'
            : isExtraSmall && !isDeposit
              ? 'inherit'
              : 'inherit'
      }
      {...rest}
    >
      {customValue
        ? customValue
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
  );
};

export { Address };
