import { AddressUtils, Bech32Prefix, TypeUser } from 'bakosafe';

type AddressFormatter = (address: string) => string;
type AddressFormatterMap = Partial<Record<TypeUser, AddressFormatter>>;

/**
 * Returns a formatted version of the provided address based on the user's authentication type.
 *
 * The formatting logic uses a dynamic mapping between `TypeUser` values
 * and the corresponding Bech32 formatter.
 *
 * - WEB_AUTHN → Bech32-encoded passkey address
 * - SOCIAL → Bech32-encoded social address
 *
 * If no formatter exists for the given user type, the original address is returned unchanged.
 *
 * @param address - The raw address to be formatted.
 * @param userType - The type of authenticated user.
 * @returns The formatted address string.
 */
const formatAddressByUserType = (
  address: string,
  userType: TypeUser,
): string => {
  const formatters: AddressFormatterMap = {
    [TypeUser.WEB_AUTHN]: (addr) =>
      AddressUtils.toBech32(addr, Bech32Prefix.PASSKEY),
    [TypeUser.SOCIAL]: (addr) =>
      AddressUtils.toBech32(addr, Bech32Prefix.SOCIAL),
  };

  const formatter = formatters[userType];
  return formatter ? formatter(address) : address;
};

export { formatAddressByUserType };
