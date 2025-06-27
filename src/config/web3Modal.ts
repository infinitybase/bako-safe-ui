import { http, type Config, createConfig, injected } from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains';
import { type Web3Modal, createWeb3Modal } from '@web3modal/wagmi';
import { walletConnect } from '@wagmi/connectors';

interface CreateWeb3ModalProps {
  wagmiConfig: Config;
  projectId?: string;
}

// TODO - change to Infinitybase ID
const VITE_REOWN_PROJECT_ID = import.meta.env.VITE_REOWN_PROJECT_ID;

export const createWagmiConfig = (): Config =>
  createConfig({
    chains: [sepolia, mainnet],
    syncConnectedChain: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    connectors: [
      injected({ shimDisconnect: false }),
      walletConnect({
        projectId: VITE_REOWN_PROJECT_ID,
        metadata: {
          name: 'Bako Safe',
          description: 'Bako Safe | The Native Multisig of Fuel Network',
          url: 'https://safe.bako.global',
          icons: [
            'https://cdn.prod.website-files.com/65de1e72f1c23fd91f7c3b88/65e201f7f3b663abed2309a5_favicon_large.png',
          ],
        },
      }),
    ],
  });

export function createWeb3ModalInstance({
  wagmiConfig,
}: CreateWeb3ModalProps): Web3Modal {
  const projectId = VITE_REOWN_PROJECT_ID;
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
  });
}
