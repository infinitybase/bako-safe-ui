import { Address } from 'fuels';

const values = {
  signature:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  address: '0x0000000000000000000000000000000000000000000000000000000000000000',
};

class VaultUtils {
  static makeSubscribers(subscribers: string[]) {
    const array = [];
    const signaturesLength = subscribers.length;
    for (let i = 0; i < 10; i++) {
      if (i < signaturesLength) {
        array.push(Address.fromString(subscribers[i]).toHexString());
      } else {
        //todo: verify change user_aux by '0x00...0'
        array.push(values['address']);
      }
    }

    return array;
  }

  static makeHashPredicate() {
    const array = [];

    const random = () => {
      return Math.round(Math.random() * 10);
    };

    for (let i = 0; i < 20; i++) {
      array.push(random());
    }

    return array;
  }
}

export { VaultUtils };
