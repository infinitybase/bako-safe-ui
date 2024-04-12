import * as CryptoJS from 'crypto-js';

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
  //todo: move to public env
  private static encryptionKey = 'chave-secreta';

  static setCookies(cookies: Cookie[]) {
    cookies.forEach((cookie) => {
      localStorage.setItem(cookie.name, this.encrypt(cookie.value));
    });
  }

  static getCookie(name: string) {
    return this.decrypt(localStorage.getItem(name) || '');
  }

  static removeCookies(names: string[]) {
    names.forEach((name) => localStorage.removeItem(name));
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
