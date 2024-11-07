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
    const provider = await Provider.create(networkUrl);
    const sync = await OffChainSync.create(provider);

    return new OffChainSyncInstance(sync);
  }

  get instance(): OffChainSync {
    return this._instance;
  }
}
