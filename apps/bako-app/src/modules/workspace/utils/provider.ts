import { CookieName, CookiesConfig } from '@/modules/core/utils';
import { BakoProvider } from 'bakosafe';

export class ProviderInstance {
  private _instance: BakoProvider;

  protected constructor(provider: BakoProvider) {
    this._instance = provider;
  }

  public static async create(networkUrl: string): Promise<ProviderInstance> {
    const address = CookiesConfig.getCookie(CookieName.ADDRESS);
    const token = CookiesConfig.getCookie(CookieName.ACCESS_TOKEN);
    const provider = await BakoProvider.create(networkUrl, { address, token });

    return new ProviderInstance(provider);
  }

  get instance(): BakoProvider {
    return this._instance;
  }
}
