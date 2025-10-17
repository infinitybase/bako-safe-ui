import { AddressUtils as BakoAddressUtils, BakoProvider } from 'bakosafe';
import { Address, isB256 } from 'fuels';

export enum Batch32Prefix {
  PASSKEY = 'passkey',
}

export type Batch32 = `${Batch32Prefix}.${string}`;

export class AddressUtils {
  static isValid(address: string, allowEvm = true) {
    try {
      return (
        (allowEvm && BakoAddressUtils.isEvm(address)) ||
        BakoAddressUtils.isPasskey(address) ||
        isB256(address)
      );
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

  static toBech32 = BakoAddressUtils.toPasskey;

  static fromBech32 = (address: Batch32) => {
    return BakoAddressUtils.fromBech32(address);
  };

  static equal(a: string, b: string) {
    const addressA = new Address(a);
    return addressA.equals(new Address(b));
  }
}

export class AddressValidator {
  private addresses: Map<string, boolean>;

  constructor(public provider: Promise<BakoProvider>) {
    this.addresses = new Map();
  }

  async isValid(address: string) {
    if (this.addresses.has(address)) {
      return this.addresses.get(address)!;
    }

    const provider = await this.provider;
    const addressType = await provider.getAddressType(address);
    const isValid = ['Account', 'Contract'].includes(addressType);
    this.addresses.set(address, isValid);

    return isValid;
  }
}
