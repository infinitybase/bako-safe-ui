import * as CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const { VITE_ENCRYPTION_KEY } = import.meta.env;

export enum CookieName {
  ACCESS_TOKEN = `bakosafe/token`,
  ACCOUNT_TYPE = `bakosafe/account_type`,
  ADDRESS = `bakosafe/address`,
  AVATAR = `bakosafe/avatar`,
  USER_ID = `bakosafe/user_id`,
  SINGLE_WORKSPACE = `bakosafe/single_workspace`,
  SINGLE_CONTACTS = `bakosafe/single_contacts`,
  WORKSPACE = `bakosafe/workspace`,
  PERMISSIONS = `bakosafe/permissions`,
  WEB_AUTHN_ID = `bakosafe/web_authn_id`,
  WEB_AUTHN_PK = `bakosafe/web_authn_pk`,
}

interface Cookie {
  name: CookieName;
  value: string;
}

export class CookiesConfig {
  private static encryptionKey = VITE_ENCRYPTION_KEY;

  static setCookies(cookies: Cookie[]) {
    cookies.forEach((cookie) => {
      Cookies.set(cookie.name, this.encrypt(cookie.value));
    });
  }

  static getCookie(name: string) {
    const ck = Cookies.get(name) ?? '';
    return this.decrypt(ck);
  }

  static removeCookies(names: string[]) {
    names.forEach((name) => Cookies.remove(name));
  }

  private static encrypt(value: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        value,
        this.encryptionKey,
      ).toString();

      return encrypted;
    } catch (e) {
      return `${crypto.randomUUID()}`;
    }
  }

  private static decrypt(encryptedValue: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        encryptedValue,
        this.encryptionKey,
      ).toString(CryptoJS.enc.Utf8);

      return decrypted;
    } catch (e) {
      return `${crypto.randomUUID()}`;
    }
  }
}
