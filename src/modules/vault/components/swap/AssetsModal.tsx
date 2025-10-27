import {
  DialogOpenChangeDetails,
  Field,
  Icon,
  Image,
  Input,
  InputGroup,
  Separator,
  Stack,
  Text,
} from 'bako-ui';
import { BN } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiSearch as SearchIcon } from 'react-icons/fi';

import { Dialog } from '@/components';
import { Asset, CurrencyList } from '@/modules/core';

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
      modalContentProps={{ padding: 0 }}
      open={isOpen}
      onOpenChange={handleCloseModal}
      size={{ base: 'full', sm: 'sm' }}
    >
      <Dialog.Header
        mt={3}
        mb={3}
        px={6}
        title="Select Asset"
        onClose={() => handleCloseModal({ open: false })}
      />
      <Dialog.Body>
        <Stack gap={4}>
          <Field.Root px={6}>
            <InputGroup
              position="relative"
              endElement={<Icon as={SearchIcon} color="textPrimary" />}
            >
              <Input
                variant="subtle"
                onChange={(e) => debouncedSearch(e)}
                placeholder="Search asset"
              />
            </InputGroup>
          </Field.Root>

          <Separator borderColor="grey.500" />

          <CurrencyList.Root px={6}>
            {filteredAssets.map((asset) => (
              <CurrencyList.Item
                key={asset.assetId}
                value={asset.assetId}
                isSelected={false}
                onSelect={handleSelect}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Image boxSize="24px" src={asset.icon} alt={asset.name} />
                <Stack gap={0}>
                  <Text fontSize="md" color="gray.50">
                    {asset.slug}
                  </Text>
                  <Text fontSize="xs" color="gray.50">
                    {asset.name}
                  </Text>
                </Stack>

                {asset.balance && (
                  <Text ml="auto" fontSize="xs" color="gray.50">
                    {asset.balance.formatUnits(asset.units)}
                  </Text>
                )}
              </CurrencyList.Item>
            ))}

            {!filteredAssets.length && !isLoading && (
              <CurrencyList.Empty emptyMessage="No assets available" />
            )}

            {isLoading && <CurrencyList.Loading />}
          </CurrencyList.Root>
        </Stack>
      </Dialog.Body>
    </Dialog.Modal>
  );
};
