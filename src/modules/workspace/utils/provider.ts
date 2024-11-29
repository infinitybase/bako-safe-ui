import { BakoProvider } from 'bakosafe';

import { CookieName, CookiesConfig } from '@/config/cookies';

export class ProviderInstance {
  private _instance: BakoProvider;

  protected constructor(provider: BakoProvider) {
    this._instance = provider;
  }

  public static async create(networkUrl: string): Promise<ProviderInstance> {
    const address = CookiesConfig.getCookie(CookieName.ADDRESS);
    const token = CookiesConfig.getCookie(CookieName.ACCESS_TOKEN);
    const url = networkUrl ?? import.meta.env.VITE_NETWORK;
    const provider = await BakoProvider.create(url, { address, token });

    return new ProviderInstance(provider);
  }

  get instance(): BakoProvider {
    return this._instance;
  }
}
