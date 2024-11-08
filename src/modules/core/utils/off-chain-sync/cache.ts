import { OffChainData } from '@bako-id/sdk';
import * as CryptoJS from 'crypto-js';

import { Nullable, Optional } from '../types';

const { VITE_ENCRYPTION_KEY } = import.meta.env;

export type IOffChainSyncCache = Omit<OffChainData, 'records'>;

const OFF_CHAIN_SYNC_CACHE = 'bakosafe/off-chain-sync-cache';

export class OffChainSyncCache {
  private static cacheKey = OFF_CHAIN_SYNC_CACHE;
  private static encryptionKey = VITE_ENCRYPTION_KEY;

  static getCache(): IOffChainSyncCache {
    const cache = localStorage.getItem(this.cacheKey);
    if (!cache) return this.createEmptyCache();

    return this.decrypt(cache);
  }

  static updateCache(handle: string, resolver: string): void {
    const cache = this.getCache();
    cache.resolversName[handle] = resolver;
    cache.resolversAddress[resolver] = handle;
    this.saveCache(cache);
  }

  static removeItem(handle: string, resolver: string): void {
    const cache = this.getCache();
    delete cache.resolversName[handle];
    delete cache.resolversAddress[resolver];
    this.saveCache(cache);
  }

  static getCachedResolverFromHandle(handle: string): Optional<string> {
    return this.getCache().resolversName[handle];
  }

  static getCachedHandleFromResolver(resolver: string): Optional<string> {
    return this.getCache().resolversAddress[resolver];
  }

  private static saveCache(cache: IOffChainSyncCache): void {
    const encryptedCache = this.encrypt(cache);

    if (encryptedCache) {
      localStorage.setItem(this.cacheKey, encryptedCache);
    } else {
      console.error('Failed to encrypt cache data. Cache not updated.');
    }
  }

  private static encrypt(data: IOffChainSyncCache): Nullable<string> {
    try {
      const stringData = JSON.stringify(data);
      return CryptoJS.AES.encrypt(stringData, this.encryptionKey).toString();
    } catch (error) {
      console.error('Error encrypting cache data: ', error);
      return null;
    }
  }

  private static decrypt(data: string): IOffChainSyncCache {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptionKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error decrypting cache data: ', error);
      return this.createEmptyCache();
    }
  }

  private static createEmptyCache(): IOffChainSyncCache {
    return { resolversName: {}, resolversAddress: {} };
  }
}
