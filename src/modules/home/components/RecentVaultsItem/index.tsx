import { GridItem } from 'bako-ui';
import { memo } from 'react';
import { NavigateFunction } from 'react-router-dom';

import { CustomSkeleton } from '@/components';
import {
  ExtraVaultCard,
  IUserInfos,
  Pages,
  PredicateAndWorkspace,
  VaultCard,
} from '@/modules';

interface RecentVaultsItemProps {
  predicate: PredicateAndWorkspace;
  extraCount: number;
  isLastVault: boolean;
  userInfos: IUserInfos;
  onNavigate: NavigateFunction;
  handleWorkspaceSelection: (workspaceId: string, path: string) => void;
  isLoading: boolean;
}

const RecentVaultsItem = memo(
  ({
    predicate,
    extraCount,
    isLastVault,
    userInfos,
    onNavigate,
    handleWorkspaceSelection,
    isLoading,
  }: RecentVaultsItemProps) => {
    const hasMore = extraCount > 0;
    return (
      <CustomSkeleton loading={isLoading} maxH={{ base: 180, sm: 190 }}>
        <GridItem>
          {isLastVault && hasMore ? (
            <ExtraVaultCard
              mt={{ base: 6, sm: 'unset' }}
              maxH={{ base: 185, sm: 190 }}
              extra={extraCount}
              onClick={() =>
                onNavigate(
                  Pages.userVaults({
                    workspaceId: userInfos.workspace?.id,
                  }),
                )
              }
            />
          ) : (
            <VaultCard
              ownerId={predicate.owner.id}
              name={predicate.name}
              workspace={predicate.workspace}
              title={predicate.description}
              members={predicate.members!}
              onClick={() =>
                handleWorkspaceSelection(
                  predicate.workspace.id,
                  Pages.detailsVault({
                    workspaceId: predicate.workspace.id,
                    vaultId: predicate.id,
                  }),
                )
              }
              inHome
              isHidden={predicate.isHidden}
              address={predicate.predicateAddress}
            />
          )}
        </GridItem>
      </CustomSkeleton>
    );
  },
);

RecentVaultsItem.displayName = 'RecentVaultsItem';

export default RecentVaultsItem;
