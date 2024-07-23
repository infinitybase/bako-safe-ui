import { useMemo, useState } from 'react';

import {
  BitCoinIcon,
  CoinsIcon,
  MoreLessIcon,
  RecoveryIcon,
} from '@/components';
import { useAuth } from '@/modules/auth';
import { PermissionRoles } from '@/modules/core/models';
import { UseVaultDetailsReturn } from '@/modules/vault/hooks';
import { useGetWorkspaceRequest } from '@/modules/workspace/hooks';

import { TabState, useAPIToken } from './APIToken';
import { FeatureConfig, useCommingSoon } from './CommingSoon';

export const requiredCLIRoles = [
  PermissionRoles.ADMIN,
  PermissionRoles.OWNER,
  PermissionRoles.MANAGER,
];

export enum CLIFeaturesLabels {
  API_TOKEN = 'API Tokens',
  ADD_OTHER_TOKENS = 'Add other tokens',
  RECOVERY = 'Recovery',
  SPEND_LIMIT = 'Spend limit',
}

const useCLI = (vault: UseVaultDetailsReturn['vault']) => {
  const { userId } = useAuth();

  const { workspace } = useGetWorkspaceRequest(
    vault?.predicate.workspace?.id ?? '',
  );
  const [selectedFeature, setSelectedFeature] = useState<FeatureConfig | null>(
    null,
  );

  const hasPermission = useMemo(() => {
    const memberPermission = workspace?.permissions[userId];
    const hasRequiredPermission =
      memberPermission &&
      requiredCLIRoles.filter((p) => (memberPermission[p] ?? []).includes('*'))
        .length > 0;

    const hasPerm = hasRequiredPermission;
    return hasPerm;
  }, [userId, vault, workspace]);

  const { dialog, steps, tabs, create, remove, list, hasToken } =
    useAPIToken(hasPermission);

  const { commingSoonDialog, features, handleAction } = useCommingSoon();

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
