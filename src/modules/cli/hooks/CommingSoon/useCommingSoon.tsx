import { Icon } from 'bako-ui';
import { IoIosCheckmarkCircle } from 'react-icons/io';

import {
  useDisclosure,
  UseDisclosureReturn,
} from '@/modules/core/hooks/useDisclosure';
import { useNotification } from '@/modules/notification/hooks/useNotification';
import { createGTMCustomEvent } from '@/utils';

import { CLIFeaturesLabels } from '../useCLI';

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
  const toast = useNotification();

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

  const handleNotify = () => {
    toast({
      status: 'success',
      duration: 5000,
      isClosable: false,
      title: 'Email notification activated!',
      description: 'We will notify you when this feature becomes available.',
      icon: (
        <Icon fontSize="xl" color="success.700" as={IoIosCheckmarkCircle} />
      ),
    });

    commingSoonDialog.onClose();
  };

  const features = {
    [CLIFeaturesLabels.API_TOKEN]: {
      dialogDescription: '',
      notifyHandler: () => {},
    },

    [CLIFeaturesLabels.ADD_OTHER_TOKENS]: {
      dialogDescription:
        'This Add other tokens method is not available for now',
      notifyHandler: handleNotify,
    },
    [CLIFeaturesLabels.RECOVERY]: {
      dialogDescription: 'This Recovery method is not available for now',
      notifyHandler: handleNotify,
    },
    [CLIFeaturesLabels.SPEND_LIMIT]: {
      dialogDescription: 'This Spend limit method is not available for now',
      notifyHandler: handleNotify,
    },
  };

  return {
    commingSoonDialog,
    features,
    handleAction,
  };
};

export { useCommingSoon };
