import { useDisclosure, UseDisclosureReturn } from '@chakra-ui/react';
import { CLIFeaturesLabels } from '../useCLI';

export interface FeatureConfig {
  dialogDescription: string;
  gtmEventName: string;
  gtmButtonId: string;
  gtmDescription: string;
  notifyHandler: () => void;
}

export interface UseCommingSoonProps {
  commingSoonDialog: UseDisclosureReturn;
  features: {
    [key in CLIFeaturesLabels]: FeatureConfig;
  };
}

const useCommingSoon = () => {
  const commingSoonDialog = useDisclosure();

  const features = {
    [CLIFeaturesLabels.API_TOKEN]: {
      dialogDescription: '',
      gtmEventName: '',
      gtmButtonId: '',
      gtmDescription: '',
      notifyHandler: () => {},
    },

    [CLIFeaturesLabels.ADD_OTHER_TOKENS]: {
      dialogDescription:
        'This Add other tokens method is not available for now',
      gtmEventName: 'add_other_tokens_button_clicked',
      gtmButtonId: 'add_other_tokens',
      gtmDescription: 'Vault - Settings - Add other tokens',
      notifyHandler: () => {},
    },
    [CLIFeaturesLabels.RECOVERY]: {
      dialogDescription: 'This Recovery method is not available for now',
      gtmEventName: 'recovery_button_clicked',
      gtmButtonId: 'recovery',
      gtmDescription: 'Vault - Settings - Recovery',
      notifyHandler: () => {},
    },
    [CLIFeaturesLabels.SPEND_LIMIT]: {
      dialogDescription: 'This Spend limit method is not available for now',
      gtmEventName: 'spend_limit_button_clicked',
      gtmButtonId: 'spend_limit',
      gtmDescription: 'Vault - Settings - Spend Limit',
      notifyHandler: () => {},
    },
  };

  return {
    commingSoonDialog,
    features,
  };
};

export { useCommingSoon };
