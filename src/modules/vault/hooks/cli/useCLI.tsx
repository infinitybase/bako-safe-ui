import {
  BitCoinIcon,
  CoinsIcon,
  MoreLessIcon,
  RecoveryIcon,
} from '@/components';

const useCLI = () => {
  const settings = [
    {
      label: 'API Tokens',
      icon: CoinsIcon,
      disabled: false,
      onClick: () => {},
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
    settings: settings,
  };
};

export { useCLI };
