import { OffChainSync } from '@bako-id/sdk';
import { Provider } from 'fuels';

export class OffChainSyncInstance {
  private _instance: OffChainSync;

  protected constructor(sync: OffChainSync) {
    this._instance = sync;
  }

  public static async create(
    networkUrl: string,
  ): Promise<OffChainSyncInstance> {
    const url = networkUrl ?? import.meta.env.VITE_NETWORK;

    const provider = await Provider.create(url);
    const sync = await OffChainSync.create(provider);

    return new OffChainSyncInstance(sync);
  }

  get instance(): OffChainSync {
    return this._instance;
  }
}
