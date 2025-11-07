import { Card, Flex, Heading, Icon } from 'bako-ui';
import { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ListHorizontalIcon, PieChartIcon } from '@/components';
import { ChevronRightIcon } from '@/components/icons/chevron-right';
import { Pages } from '@/modules/core';

import { useVaultAllocationRequest, UseVaultDetailsReturn } from '../../hooks';
import { VaultIconInfo } from '../vaultIconInfo';
import { AssetsList } from './AssetList';
import Donut from './Donut';
import { AllocationSkeleton } from './Skeleton';

interface AccountAllocationProps {
  assets: UseVaultDetailsReturn['assets'];
  vault: UseVaultDetailsReturn['vault'];
  workspaceId: string;
}

export const AccountAllocation = memo(
  ({ assets, vault, workspaceId }: AccountAllocationProps) => {
    const [mode, setMode] = useState<'allocation' | 'assets'>('assets');

    const isLoading = useMemo(
      () => assets.isLoading || vault.isLoading,
      [assets.isLoading, vault.isLoading],
    );
    const { allocation, isLoading: isLoadingAllocation } =
      useVaultAllocationRequest(vault.data?.id);
    const navigate = useNavigate();

    const handleNavigateToAssets = () => {
      navigate(
        Pages.vaultBalance({
          vaultId: vault?.data.id || '',
          workspaceId,
        }),
      );
    };

    const handleToggleMode = useCallback(() => {
      setMode((prevMode) =>
        prevMode === 'allocation' ? 'assets' : 'allocation',
      );
    }, []);

    return (
      <Card.Root
        variant="subtle"
        bg="bg.panel"
        rounded="2xl"
        minW="240px"
        h="292px"
      >
        {isLoading && <AllocationSkeleton />}
        {!isLoading && (
          <>
            <Card.Header>
              <Flex justify="space-between" align="center">
                <Heading color="textPrimary" fontSize="sm" lineHeight="shorter">
                  Allocation
                </Heading>
                <Flex align="center" gap={2}>
                  <VaultIconInfo
                    tooltipContent={
                      mode === 'assets' ? 'Chart View' : 'List View'
                    }
                    placement="top"
                    onClick={handleToggleMode}
                  >
                    <Icon
                      as={mode === 'assets' ? PieChartIcon : ListHorizontalIcon}
                      w="12px"
                      color="gray.200"
                    />
                  </VaultIconInfo>
                  <VaultIconInfo
                    tooltipContent="View all"
                    placement="top"
                    onClick={handleNavigateToAssets}
                  >
                    <Icon as={ChevronRightIcon} w="12px" color="gray.200" />
                  </VaultIconInfo>
                </Flex>
              </Flex>
            </Card.Header>
            {mode === 'allocation' ? (
              <Donut allocation={allocation} isLoading={isLoadingAllocation} />
            ) : (
              <AssetsList assets={assets.assets || []} />
            )}
          </>
        )}
      </Card.Root>
    );
  },
);

AccountAllocation.displayName = 'AccountAllocation';
