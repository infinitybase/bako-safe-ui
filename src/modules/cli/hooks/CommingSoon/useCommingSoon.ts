import { useDisclosure, UseDisclosureReturn } from '@chakra-ui/react';
import { CLIFeaturesLabels } from '../useCLI';
import { createGTMCustomEvent } from '@/utils';

export interface FeatureConfig {
  dialogDescription: string;
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

  const handleAction = (field: CLIFeaturesLabels) => {
    switch (field) {
      case CLIFeaturesLabels.ADD_OTHER_TOKENS:
        createGTMCustomEvent({
          buttonId: 'add_other_tokens',
          eventName: 'add_other_tokens_button_clicked',
          description: 'Vault - Settings - Add other tokens',
        });
        break;
      case CLIFeaturesLabels.RECOVERY:
        createGTMCustomEvent({
          buttonId: 'recovery',
          eventName: 'recovery_button_clicked',
          description: 'Vault - Settings - Recovery',
        });
        break;
      case CLIFeaturesLabels.SPEND_LIMIT:
        createGTMCustomEvent({
          buttonId: 'spend_limit',
          eventName: 'spend_limit_button_clicked',
          description: 'Vault - Settings - Spend Limit',
        });
        break;
    }
  };

  const features = {
    [CLIFeaturesLabels.API_TOKEN]: {
      dialogDescription: '',
      notifyHandler: () => {},
    },

    [CLIFeaturesLabels.ADD_OTHER_TOKENS]: {
      dialogDescription:
        'This Add other tokens method is not available for now',
      notifyHandler: () => {},
    },
    [CLIFeaturesLabels.RECOVERY]: {
      dialogDescription: 'This Recovery method is not available for now',
      notifyHandler: () => {},
    },
    [CLIFeaturesLabels.SPEND_LIMIT]: {
      dialogDescription: 'This Spend limit method is not available for now',
      notifyHandler: () => {},
    },
  };

  return {
    commingSoonDialog,
    features,
    handleAction,
  };
};

export { useCommingSoon };
