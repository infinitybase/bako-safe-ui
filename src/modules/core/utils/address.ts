import { isB256, isBech32 } from 'fuels';

class AddressUtils {
  static isValid(address: string) {
    try {
      return isBech32(address) || isB256(address);
    } catch (e) {
      return false;
    }
  }

  static format(address: string) {
    return `${address.slice(0, 10)}...${address.slice(-5)}`;
  }
}

export { AddressUtils };
