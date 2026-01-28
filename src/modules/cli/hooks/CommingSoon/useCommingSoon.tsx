import { Icon, useDisclosure, UseDisclosureReturn } from '@chakra-ui/react';
import { IoIosCheckmarkCircle } from 'react-icons/io';

import { useContactToast } from '@/modules';
import { ExportWallet } from '@/modules/cli/services';
import { useNotification } from '@/modules/notification/hooks/useNotification';
import { createGTMCustomEvent } from '@/utils';
import { downloadJson } from '@/utils/download-json';

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

const useCommingSoon = (predicateAddress: string) => {
  const commingSoonDialog = useDisclosure();
  const toast = useNotification();
  const { errorToast } = useContactToast();

  const handleAction = async (field: CLIFeaturesLabels) => {
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
      case CLIFeaturesLabels.EXPORT_WALLET:
        await exportWallet();
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

  const exportWallet = async () => {
    if (!predicateAddress) return;

    try {
      const { config, name } = await ExportWallet.getByAddress({
        address: predicateAddress,
      });

      const json = {
        config,
      };

      downloadJson(`${name}`, json);
    } catch (error) {
      console.error('Export wallet error:', error);
      errorToast({
        title: 'Error on export wallet',
        description:
          'An error occurred while exporting the wallet. Please try again.',
      });
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
    [CLIFeaturesLabels.EXPORT_WALLET]: {
      dialogDescription: 'This Export Wallet method is not available for now',
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
