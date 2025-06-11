import { createWeb3ModalInstance } from '@/config/web3Modal';
import { Config, disconnect, getAccount } from '@wagmi/core';
import { type Web3Modal } from '@web3modal/wagmi';
import { ApiController } from '@web3modal/core';
import { LocalStorage } from 'fuels';
import { stringToHex } from 'viem';
import { ecrecover, fromRpcSig, hashPersonalMessage, pubToAddress } from '@ethereumjs/util';
import type EventEmitter from 'node:events';

export type Maybe<T> = T | undefined | null;
export type Option<T1, T2 = string> = T1 | T2;

export interface EIP1193Provider extends EventEmitter {
  request(args: {
    method: string;
    params?: unknown[];
  }): Promise<unknown | unknown[]>;
}

export type ProviderDictionary = {
  ethProvider?: EIP1193Provider;
  [key: string]: Maybe<Option<EIP1193Provider>>;
};


export class WalletConnector {
  private wagmiConfig: Config;
  private web3Modal!: Web3Modal;
  private storage: LocalStorage;
  private ethProvider!: EIP1193Provider;

  constructor(_wagmiConfig: Config) {
    this.wagmiConfig = _wagmiConfig;
    this.storage = new LocalStorage(window.localStorage as Storage);
  }

  public async connect(): Promise<boolean> {
    const wagmiConfig = this.getWagmiConfig();
    if (!wagmiConfig) throw new Error('Wagmi config not found');

    const state = await this.requestSignatures(wagmiConfig);
    if (state === 'validated') {
      return true;
    }
    
    this.createModal();
    this.web3Modal.open();

    const unsub = this.web3Modal.subscribeEvents(async (event) => {
      switch (event.data.event) {
        case 'MODAL_OPEN':
          this.createModal();
          break;
        case 'CONNECT_SUCCESS': {         
          const { addresses = [] } = getAccount(wagmiConfig);

          let hasAccountToSign = false;
          for (const address of addresses) {
            if (await this.accountHasValidation(address)) {
              continue;
            }

            hasAccountToSign = true;
            this.storage.setItem(`SIGNATURE_VALIDATION_${address}`, 'pending');
          }

          if (hasAccountToSign) {
            this.requestSignatures(wagmiConfig);
          }
          
          unsub();
          break;
        }
        case 'MODAL_CLOSE':
        case 'CONNECT_ERROR': {
          unsub();
          break;
        }
      }
    });

    return false;
  }

  private async requestSignatures(
    wagmiConfig: Config,
  ): Promise<'validated' | 'pending'> {
    const account = getAccount(wagmiConfig);

    const { addresses = [], isConnected } = account;
    for (const address of addresses) {
      try {
        await this.requestSignature(address);
      } catch (err) {
        this.disconnect();
        throw err;
      }
    }

    if (isConnected) {
      try {
        // await this.handleConnect(account);
        return 'validated';
      } catch (err) {
        this.disconnect();
        throw err;
      }
    }

    return 'pending';
  }

  private async requestSignature(address?: string) {
    return new Promise(async (resolve, reject) => {
      const hasSignature = await this.accountHasValidation(address);
      if (hasSignature) return resolve(true);

      // Disconnect if user doesn't provide signature in time
      const validationTimeout = setTimeout(() => {
        reject(
          new Error("User didn't provide signature in less than 1 minute"),
        );
      }, 1000 * 60);
      const { ethProvider } = await this.getProviders();

      if (!ethProvider) return;

      this.signAndValidate(ethProvider, address)
        .then(() => {
          clearTimeout(validationTimeout);
          this.storage.setItem(`SIGNATURE_VALIDATION_${address}`, 'true');
          resolve(true);
        })
        .catch((err) => {
          clearTimeout(validationTimeout);
          this.storage.removeItem(`SIGNATURE_VALIDATION_${address}`);

          /*const currentConnectorEvent: CustomCurrentConnectorEvent = {
            type: this.events.currentConnector,
            data: this,
            metadata: {
              pendingSignature: false,
            },
          };*/

          // Workaround to tell Connecting dialog that now we'll request connection again
          // this.emit(this.events.currentConnector, currentConnectorEvent);
          reject(err);
        });
    });
  }

  protected async getProviders(): Promise<ProviderDictionary> {
    if (this.ethProvider) {
      return {
        ethProvider: this.ethProvider,
      };
    }
    
    const wagmiConfig = this.getWagmiConfig();
    const ethProvider = wagmiConfig
      ? ((await getAccount(
          wagmiConfig,
        ).connector?.getProvider?.()) as EIP1193Provider)
      : undefined;

    return {
      ethProvider,
    };
  }

  private async signAndValidate(
    ethProvider: EIP1193Provider | undefined,
    account?: string,
  ) {
    try {
      if (!ethProvider) {
        throw new Error('No Ethereum provider found');
      }
      if (account && !account.startsWith('0x')) {
        throw new Error('Invalid account address');
      }
      const currentAccount =
        account ||
        (
          (await ethProvider.request({
            method: 'eth_requestAccounts',
          })) as string[]
        )[0];

      if (!currentAccount) {
        throw new Error('No Ethereum account selected');
      }

      const message = `Sign this message to verify the connected account: ${currentAccount}`;
      const signature = (await ethProvider.request({
        method: 'personal_sign',
        params: [stringToHex(message), currentAccount],
      })) as string;

      if (!this.validateSignature(currentAccount, message, signature)) {
        throw new Error('Signature address validation failed');
      }

      return true;
    } catch (error) {
      this.disconnect();
      throw error;
    }
  }

  public async disconnect(): Promise<boolean> {
    const wagmiConfig = this.getWagmiConfig();
    if (!wagmiConfig) throw new Error('Wagmi config not found');

    const { connector, isConnected } = getAccount(wagmiConfig);
    await disconnect(wagmiConfig, {
      connector,
    });

    return isConnected || false;
  }

  private validateSignature(
    account: string,
    message: string,
    signature: string,
  ) {
    const msgBuffer = Uint8Array.from(Buffer.from(message));
    const msgHash = hashPersonalMessage(msgBuffer);
    const { v, r, s } = fromRpcSig(signature);
    const pubKey = ecrecover(msgHash, v, r, s);
    const recoveredAddress = Buffer.from(pubToAddress(pubKey)).toString('hex');

    // The recovered address doesn't have the 0x prefix
    return recoveredAddress.toLowerCase() === account.toLowerCase().slice(2);
  }

  private async accountHasValidation(
    account: `0x${string}` | string | undefined,
  ) {
    if (!account) return false;
    const [hasValidate] = await this.getAccountValidations([account]);
    return hasValidate;
  }

  private async getAccountValidations(
    accounts: `0x${string}`[] | string[],
  ): Promise<boolean[]> {
    return Promise.all(
      accounts.map(async (a) => {
        const isValidated = await this.storage.getItem(
          `SIGNATURE_VALIDATION_${a}`,
        );
        return isValidated === 'true';
      }),
    );
  }

  private createModal() {
    this.web3Modal = this.modalFactory();
    ApiController.prefetch();
  }

  private modalFactory(): Web3Modal {
    return createWeb3ModalInstance({
      wagmiConfig: this.wagmiConfig,
    });
  }

  private getWagmiConfig():Config {
    return this.wagmiConfig;
  }
}
