import { Card, Flex, Heading, Icon } from 'bako-ui';
import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChevronRightIcon } from '@/components/icons/chevron-right';
import { Pages } from '@/modules/core';

import { UseVaultDetailsReturn } from '../../hooks';
import { VaultIconInfo } from '../vaultIconInfo';
import { AssetsList } from './AssetList';
import { AllocationSkeleton } from './Skeleton';

interface AccountAllocationProps {
  assets: UseVaultDetailsReturn['assets'];
  vault: UseVaultDetailsReturn['vault'];
  workspaceId: string;
}

export const AccountAllocation = memo(
  ({ assets, vault, workspaceId }: AccountAllocationProps) => {
    const isLoading = useMemo(
      () => assets.isLoading || vault.isLoading,
      [assets.isLoading, vault.isLoading],
    );
    const navigate = useNavigate();

    const handleNavigateToAssets = () => {
      navigate(
        Pages.vaultBalance({
          vaultId: vault?.data.id || '',
          workspaceId,
        }),
      );
    };

    return (
      <Card.Root
        variant="subtle"
        bg="bg.panel"
        rounded="2xl"
        minW="240px"
        h="full"
      >
        {isLoading && <AllocationSkeleton />}
        {!isLoading && (
          <>
            <Card.Header>
              <Flex justify="space-between" align="center">
                <Heading color="textPrimary" fontSize="sm" lineHeight="shorter">
                  Allocation
                </Heading>

                <VaultIconInfo
                  tooltipContent="Assets"
                  placement="top"
                  onClick={handleNavigateToAssets}
                >
                  <Icon as={ChevronRightIcon} w="12px" color="gray.200" />
                </VaultIconInfo>
              </Flex>
            </Card.Header>
            <AssetsList assets={assets.assets || []} />
          </>
        )}
      </Card.Root>
    );
  },
);

AccountAllocation.displayName = 'AccountAllocation';
