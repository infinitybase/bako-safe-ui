import { isB256, isBech32 } from 'fuels';

class AddressUtils {
  static isValid(address: string) {
    try {
      return isBech32(address) || isB256(address);
    } catch (e) {
      return false;
    }
  }
}

export { AddressUtils };
