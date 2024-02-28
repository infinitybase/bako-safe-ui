import { concat } from 'ethers';
import { arrayify, bn, U64Coder } from 'fuels';

enum SignatureType {
  WEB_AUTHN = 0,
  FUEL = 1,
}

type Signature =
  | {
      type: SignatureType.WEB_AUTHN;
      signature: string;
      prefix: string;
      suffix: string;
      authData: string;
    }
  | {
      type: SignatureType.FUEL;
      signature: string;
    };

function encodeSignature(sig: Signature) {
  const typeBytes = new U64Coder().encode(bn(sig.type));
  switch (sig.type) {
    case SignatureType.WEB_AUTHN: {
      const prefixBytes = arrayify(sig.prefix);
      const suffixBytes = arrayify(sig.suffix);
      const authDataBytes = arrayify(sig.authData);
      return concat([
        typeBytes,
        sig.signature,
        new U64Coder().encode(bn(prefixBytes.length)),
        new U64Coder().encode(bn(suffixBytes.length)),
        new U64Coder().encode(bn(authDataBytes.length)),
        prefixBytes,
        suffixBytes,
        authDataBytes,
      ]);
    }
    case SignatureType.FUEL:
      return concat([typeBytes, sig.signature]);
    default:
      throw new Error('Not implemented');
  }
}

export { encodeSignature, Signature, SignatureType };
