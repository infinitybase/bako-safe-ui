import {
  Box,
  DialogOpenChangeDetails,
  Field,
  Icon,
  Image,
  Input,
  InputGroup,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';
import { BN } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiSearch as SearchIcon } from 'react-icons/fi';

import { Dialog } from '@/components';
import { Header } from '@/layouts/dashboard/header';
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
    // eslint-disable-next-line react-compiler/react-compiler
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
    >
      <Box display={{ base: 'block', sm: 'none' }} w="full">
        <Header />
      </Box>
      <Dialog.Header
        mt={3}
        mb={3}
        px={4}
        title="Select Asset"
        onClose={() => handleCloseModal({ open: false })}
      />
      <Dialog.Body py={{ base: 0, sm: 2 }}>
        <Stack gap={4}>
          <Field.Root px={4}>
            <InputGroup
              position="relative"
              endElement={<Icon as={SearchIcon} color="grey.500" />}
            >
              <Input
                bg="dark.950"
                onChange={(e) => debouncedSearch(e)}
                placeholder=" "
              />
            </InputGroup>
            <Field.Label>Search asset</Field.Label>
          </Field.Root>

          <Separator borderColor="grey.500" />

          <CurrencyList.Root pr={2} pl={4}>
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
                  <Text fontSize="md" color="grey.50">
                    {asset.slug}
                  </Text>
                  <Text fontSize="xs" color="grey.50">
                    {asset.name}
                  </Text>
                </Stack>

                {asset.balance && (
                  <Text ml="auto" fontSize="xs" color="grey.50">
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
