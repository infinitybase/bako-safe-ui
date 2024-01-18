import Cookies from 'js-cookie';

const { VITE_COOKIE_EXPIRATION_TIME } = import.meta.env;

export enum CookieName {
  ACCESS_TOKEN = `bsafe/token`,
  ADDRESS = `bsafe/address`,
  AVATAR = `bsafe/avatar`,
  USER_ID = `bsafe/user_id`,
  WORKSPACE = `bsafe/workspace`,
  PERMISSIONS = `bsafe/permissions`,
}

interface Cookie {
  name: CookieName;
  value: string;
}

export class CookiesConfig {
  static setCookies(cookies: Cookie[]) {
    const expiresAt =
      new Date().getTime() + Number(VITE_COOKIE_EXPIRATION_TIME) * 60 * 1000;

    cookies.forEach((cookie) => {
      Cookies.set(cookie.name, cookie.value, {
        secure: true,
        expires: new Date(expiresAt),
      });
    });
  }

  static getCookie(name: string) {
    return Cookies.get(name);
  }

  static removeCookies(names: string[]) {
    names.forEach((name) => Cookies.remove(name));
  }
}
