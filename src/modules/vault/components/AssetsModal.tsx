import {
  DialogOpenChangeDetails,
  Field,
  Icon,
  Input,
  InputGroup,
  Separator,
  Stack,
} from 'bako-ui';
import { BN } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiSearch as SearchIcon } from 'react-icons/fi';

import { Dialog } from '@/components';
import { Asset } from '@/modules/core';
import { AssetList } from '@/modules/vault/components/asset-list';

interface AssetsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: DialogOpenChangeDetails) => void;
  assets: (Asset & { balance: BN | null })[];
  isLoading?: boolean;
  onSelect: (asset: string) => void;
}

export const AssetsModal = ({
  isOpen,
  onOpenChange,
  assets,
  isLoading = false,
  onSelect,
}: AssetsModalProps) => {
  const [search, setSearch] = useState('');

  const handleSelect = useCallback(
    (assetId: string) => {
      onSelect(assetId);
      onOpenChange({ open: false });
      setSearch('');
    },
    [onSelect, onOpenChange, setSearch],
  );

  const handleCloseModal = useCallback(
    (e: DialogOpenChangeDetails) => {
      setSearch('');
      onOpenChange(e);
    },
    [onOpenChange, setSearch],
  );

  const debouncedSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    }, 400),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) => {
        const searchLower = search.toLowerCase();
        return (
          asset.slug.toLowerCase().includes(searchLower) ||
          asset.name.toLowerCase().includes(searchLower) ||
          asset.assetId.toLowerCase().includes(searchLower)
        );
      }),
    [assets, search],
  );

  return (
    <Dialog.Modal
      open={isOpen}
      onOpenChange={handleCloseModal}
      size={{ base: 'full', sm: 'sm' }}
      modalContentProps={{
        maxH: '100vh',
        h: '690px',
        p: 0,
      }}
    >
      <Dialog.Header
        mb={{ base: 2, sm: 6 }}
        px={6}
        title="Asset"
        titleSxProps={{
          fontSize: 'md',
          color: 'gray.50',
          lineHeight: '100%',
          fontWeight: 'bold',
        }}
        description="Select the asset of your choice."
        descriptionFontSize="xs"
        descriptionColor="textSecondary"
        onClose={() => handleCloseModal({ open: false })}
      />
      <Dialog.Body
        px={6}
        display="flex"
        flexDirection="column"
        flex={1}
        minH={0}
      >
        <Stack gap={6}>
          <Field.Root>
            <InputGroup
              position="relative"
              endElement={
                <Icon as={SearchIcon} color="textPrimary" size="sm" />
              }
            >
              <Input
                bg="transparent"
                onChange={(e) => debouncedSearch(e)}
                placeholder="Search asset"
              />
            </InputGroup>
          </Field.Root>

          <Separator borderColor="grey.500" />
        </Stack>

        <AssetList.Root py={6}>
          {filteredAssets.map((asset) => (
            <AssetList.Item
              key={asset.assetId}
              asset={{
                value: asset.assetId,
                image: asset.icon,
                name: asset.name,
                symbol: asset.slug,
                balance: asset.balance?.formatUnits(asset.units),
              }}
              onSelect={(selectedAsset) => handleSelect(selectedAsset.value)}
            />
          ))}

          {!filteredAssets.length && !isLoading && <AssetList.Empty />}

          {isLoading && <AssetList.Loading />}
        </AssetList.Root>
      </Dialog.Body>
    </Dialog.Modal>
  );
};
