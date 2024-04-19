import * as CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const { VITE_COOKIE_EXPIRATION_TIME, VITE_ENCRYPTION_KEY } = import.meta.env;

export enum CookieName {
  ACCESS_TOKEN = `bsafe/token`,
  ACCOUNT_TYPE = `bsafe/account_type`,
  ADDRESS = `bsafe/address`,
  AVATAR = `bsafe/avatar`,
  USER_ID = `bsafe/user_id`,
  SINGLE_WORKSPACE = `bsafe/single_workspace`,
  SINGLE_CONTACTS = `bsafe/single_contacts`,
  WORKSPACE = `bsafe/workspace`,
  PERMISSIONS = `bsafe/permissions`,
  WEB_AUTHN_ID = `bsafe/web_authn_id`,
  WEB_AUTHN_PK = `bsafe/web_authn_pk`,
}

interface Cookie {
  name: CookieName;
  value: string;
}

export class CookiesConfig {
  private static encryptionKey = VITE_ENCRYPTION_KEY;

  static setCookies(cookies: Cookie[]) {
    const expiresAt =
      new Date().getTime() + Number(VITE_COOKIE_EXPIRATION_TIME) * 60 * 1000;

    cookies.forEach((cookie) => {
      Cookies.set(cookie.name, this.encrypt(cookie.value), {
        secure: true,
        expires: new Date(expiresAt),
      });
    });
  }

  static getCookie(name: string) {
    const ck = Cookies.get(name);
    return ck ? this.decrypt(ck) : '';
  }

  static removeCookies(names: string[]) {
    names.forEach((name) => Cookies.remove(name));
  }

  private static encrypt(value: string): string {
    const encrypted = CryptoJS.AES.encrypt(
      value,
      this.encryptionKey,
    ).toString();

    return encrypted;
  }

  private static decrypt(encryptedValue: string): string {
    const decrypted = CryptoJS.AES.decrypt(
      encryptedValue,
      this.encryptionKey,
    ).toString(CryptoJS.enc.Utf8);

    return decrypted;
  }
}
