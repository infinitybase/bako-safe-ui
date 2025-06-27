import { http, type Config, createConfig, injected } from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains';
import { type Web3Modal, createWeb3Modal } from '@web3modal/wagmi';

interface CreateWeb3ModalProps {
  wagmiConfig: Config;
  projectId?: string;
}

// TODO - change to Infinitybase ID
const DEFAULT_PROJECT_ID = 'b56e18d47c72ab683b10814fe9495694';

export const createWagmiConfig = (): Config =>
  createConfig({
    chains: [sepolia, mainnet],
    syncConnectedChain: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    connectors: [injected({ shimDisconnect: false })],
  });

export function createWeb3ModalInstance({
  wagmiConfig,
  projectId = DEFAULT_PROJECT_ID,
}: CreateWeb3ModalProps): Web3Modal {
  if (!projectId) {
    console.warn(
      '[WalletConnect Connector]: Get a project ID on https://cloud.walletconnect.com to use WalletConnect features.',
    );
  }

  return createWeb3Modal({
    wagmiConfig: {
      ...wagmiConfig,
      // @ts-ignore
      enableWalletConnect: !!projectId,
    },
    allWallets: 'ONLY_MOBILE',
    enableAnalytics: false,
    allowUnsupportedChain: true,
    projectId: projectId,
    enableWalletConnect: true,
  });
}
