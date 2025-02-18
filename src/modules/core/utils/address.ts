import { AddressUtils as BakoAddressUtils } from 'bakosafe';
import { Address, isB256 } from 'fuels';

export enum Batch32Prefix {
  PASSKEY = 'passkey',
}

export type Batch32 = `${Batch32Prefix}.${string}`;

class AddressUtils {
  static isValid(address: string) {
    try {
      return BakoAddressUtils.isPasskey(address) || isB256(address);
    } catch (e) {
      return false;
    }
  }

  static format(address: string, factor?: number) {
    const size = factor ?? 10;

    if (!address) return;
    return `${address.slice(0, size)}...${address.slice(-4)}`;
  }

  static isPasskey(value: string): boolean {
    return BakoAddressUtils.isPasskey(value);
  }

  static toBech32 = BakoAddressUtils.toBech32;

  static fromBech32 = (address: Batch32) => {
    return BakoAddressUtils.fromBech32(address);
  };

  static equal(a: string, b: string) {
    const addressA = new Address(a);
    return addressA.equals(new Address(b));
  }
}

export { AddressUtils };
