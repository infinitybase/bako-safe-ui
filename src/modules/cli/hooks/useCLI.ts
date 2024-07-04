import {
  BitCoinIcon,
  CoinsIcon,
  MoreLessIcon,
  RecoveryIcon,
} from '@/components';

import { TabState, useAPIToken } from './APIToken';

const useCLI = () => {
  const { dialog, steps, tabs, create, remove, list, hasToken } = useAPIToken();

  const settings = [
    {
      label: 'API Tokens',
      icon: CoinsIcon,
      disabled: false,
      onClick: () => {
        if (hasToken) {
          tabs.set(TabState.LIST);
        } else {
          tabs.set(TabState.CREATE);
        }

        create.dialog.onOpen();
      },
    },
    {
      label: 'Add other tokens',
      icon: BitCoinIcon,
      disabled: true,
      onClick: () => {},
    },
    {
      label: 'Recovery',
      icon: RecoveryIcon,
      disabled: true,
      onClick: () => {},
    },
    {
      label: 'Spend limit',
      icon: MoreLessIcon,
      disabled: true,
      onClick: () => {},
    },
  ];

  return {
    settings,
    APIToken: {
      dialog,
      steps,
      tabs,
      create,
      remove,
      list,
    },
  };
};

export { useCLI };
