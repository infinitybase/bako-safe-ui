import * as CryptoJS from 'crypto-js';
import { randomUUID } from 'fuels';
import Cookies from 'js-cookie';

export enum CookieName {
  ACCESS_TOKEN = 'bakosafe/token',
  ADDRESS = 'bakosafe/address',
  SINGLE_WORKSPACE = 'bakosafe/single_workspace',
}

interface Cookie {
  name: CookieName;
  value: string;
}

const CookiesConfig = {
  encryptionKey: process.env.ENCRYPTION_KEY || 'fixed_value_not_random',

  setCookies(cookies: Cookie[]) {
    if (!cookies) return;
    for (const cookie of cookies) {
      Cookies.set(cookie.name, this.encrypt(cookie.value));
    }
  },

  getCookie(name: string) {
    const ck = Cookies.get(name) ?? '';
    return this.decrypt(ck);
  },

  removeCookies(names: string[]) {
    for (const name of names) {
      Cookies.remove(name);
    }
  },

  encrypt(value: string): string {
    try {
      return CryptoJS.AES.encrypt(value, this.encryptionKey).toString();
    } catch (e) {
      console.error('Encryption error:', e);
      return randomUUID();
    }
  },

  decrypt(encryptedValue: string): string {
    try {
      return CryptoJS.AES.decrypt(encryptedValue, this.encryptionKey).toString(
        CryptoJS.enc.Utf8,
      );
    } catch (e) {
      console.error('Decryption error:', e);
      return randomUUID();
    }
  },
};

export default CookiesConfig;
