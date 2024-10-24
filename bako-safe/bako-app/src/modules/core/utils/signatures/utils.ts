import { hashMessage, Signer } from 'fuels';

class SignatureUtils {
  static recoverSignerAddress(signature: string, txId: string) {
    if (txId === '0x') return;

    return Signer.recoverAddress(hashMessage(txId), signature);
  }
}

export { SignatureUtils };
