import {
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  pubToAddress,
} from '@ethereumjs/util';
import { EncodingService } from 'bakosafe';

export class EvmSignatureUtils {
  static isMessageHex(message: string) {
    return message.startsWith('0x');
  }

  static encodeMessage(message: string, predicateVersion?: string) {
    if (!predicateVersion) return message;
    return EncodingService.encodedMessage(message, predicateVersion);
  }

  static validateSignature(
    _address: string,
    message: string,
    signature: string,
  ) {
    const msgBytes = EvmSignatureUtils.isMessageHex(message)
      ? Buffer.from(message.slice(2), 'hex')
      : Buffer.from(message, 'utf8');
    const msgBuffer = Uint8Array.from(msgBytes);
    const msgHash = hashPersonalMessage(msgBuffer);
    const { v, r, s } = fromRpcSig(signature);
    const pubKey = ecrecover(msgHash, v, r, s);
    const recoveredAddress = Buffer.from(pubToAddress(pubKey)).toString('hex');

    return recoveredAddress.toLowerCase() === _address.toLowerCase().slice(2);
  }
}
