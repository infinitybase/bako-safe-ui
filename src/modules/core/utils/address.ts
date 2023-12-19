import { isB256, isBech32 } from 'fuels';

class AddressUtils {
  static isValid(address: string) {
    try {
      return isBech32(address) || isB256(address);
    } catch (e) {
      return false;
    }
  }

  static format(address: string, factor?: number) {
    const size = factor ?? 10;

    if (!address) return;
    return `${address.slice(0, size)}...${address.slice(-1 * (size / 2))}`;
  }
}

export { AddressUtils };
