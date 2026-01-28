import { useMemo, useState } from 'react';

import {
  BitCoinIcon,
  CoinsIcon,
  MoreLessIcon,
  RecoveryIcon,
  UploadFile,
} from '@/components';
import { PredicateAndWorkspace, Workspace } from '@/modules';
import { PermissionRoles } from '@/modules/core/models';

import { TabState, useAPIToken } from './APIToken';
import { FeatureConfig, useCommingSoon } from './CommingSoon';

export const requiredCLIRoles = [
  PermissionRoles.ADMIN,
  PermissionRoles.OWNER,
  PermissionRoles.MANAGER,
  PermissionRoles.SIGNER,
];

export enum CLIFeaturesLabels {
  API_TOKEN = 'API Token',
  ADD_OTHER_TOKENS = 'Add Custom token',
  RECOVERY = 'Account Recovery',
  SPEND_LIMIT = 'Spending limit',
  EXPORT_WALLET = 'Export Wallet',
}

export interface IUseCLIProps {
  vault?: PredicateAndWorkspace;
  userId: string;
  currentWorkspace?: Workspace;
}

const useCLI = ({ currentWorkspace, userId, vault }: IUseCLIProps) => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureConfig | null>(
    null,
  );

  const hasPermission = useMemo(() => {
    // const memberPermission =
    //   vault?.owner?.id === userId
    //     ? defaultPermissions[PermissionRoles.OWNER]
    //     : defaultPermissions[PermissionRoles.SIGNER];
    // const hasRequiredPermission =
    //   memberPermission &&
    //   requiredCLIRoles.filter((p) => (memberPermission[p] ?? []).includes('*'))
    //     .length > 0;
    //
    // const hasPerm = hasRequiredPermission;
    // return hasPerm;
    return true;
  }, [userId, vault?.id, currentWorkspace]);

  const { dialog, steps, tabs, create, remove, list, hasToken } =
    useAPIToken(hasPermission);

  const { commingSoonDialog, features, handleAction } = useCommingSoon(
    vault?.predicateAddress ?? '',
  );

  const handleOpen = (feature: FeatureConfig) => {
    setSelectedFeature(feature);
    commingSoonDialog.onOpen();
  };

  const settings = [
    {
      label: CLIFeaturesLabels.API_TOKEN,
      icon: CoinsIcon,
      disabled: !hasPermission,
      onClick: () => {
        hasToken ? tabs.set(TabState.LIST) : tabs.set(TabState.CREATE);
        create.dialog.onOpen();
      },
    },
    {
      label: CLIFeaturesLabels.ADD_OTHER_TOKENS,
      icon: BitCoinIcon,
      disabled: !hasPermission,
      onClick: () => {
        handleOpen(features[CLIFeaturesLabels.ADD_OTHER_TOKENS]);
        handleAction(CLIFeaturesLabels.ADD_OTHER_TOKENS);
      },
    },
    {
      label: CLIFeaturesLabels.RECOVERY,
      icon: RecoveryIcon,
      disabled: !hasPermission,
      onClick: () => {
        handleOpen(features[CLIFeaturesLabels.RECOVERY]);
        handleAction(CLIFeaturesLabels.RECOVERY);
      },
    },
    {
      label: CLIFeaturesLabels.SPEND_LIMIT,
      icon: MoreLessIcon,
      disabled: !hasPermission,
      onClick: () => {
        handleOpen(features[CLIFeaturesLabels.SPEND_LIMIT]);
        handleAction(CLIFeaturesLabels.SPEND_LIMIT);
      },
    },
    {
      label: CLIFeaturesLabels.EXPORT_WALLET,
      icon: UploadFile,
      disabled: !hasPermission,
      onClick: () => {
        handleAction(CLIFeaturesLabels.EXPORT_WALLET);
      },
    },
  ];

  return {
    settings,
    hasPermission,
    APIToken: {
      dialog,
      steps,
      tabs,
      create,
      remove,
      list,
    },
    commingSoonFeatures: {
      commingSoonDialog,
      features,
      selectedFeature,
    },
  };
};

export { useCLI };
