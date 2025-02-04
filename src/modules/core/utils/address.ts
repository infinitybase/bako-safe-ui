import { bech32m } from 'bech32';
import { isB256, isBech32, arrayify, hexlify } from 'fuels';

export enum Batch32Prefix {
  PASSKEY = 'passkey',
}

export type Batch32 = `${Batch32Prefix}.${string}`;

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
    return `${address.slice(0, size)}...${address.slice(-4)}`;
  }

  static isPasskey(value: string): boolean {
    return value.startsWith(Batch32Prefix.PASSKEY);
  }

  static toBech32 = (address: string) =>
    <Batch32>(
      bech32m.encode(
        Batch32Prefix.PASSKEY,
        bech32m.toWords(arrayify(hexlify(address))),
      )
    );

  static fromBech32 = (address: Batch32) => {
    const { words } = bech32m.decode(address);
    const bytes = new Uint8Array(bech32m.fromWords(words));
    return hexlify(bytes);
  };
}

export { AddressUtils };
