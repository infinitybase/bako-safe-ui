import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/react';
import { BN } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Dialog } from '@/components';
import { Header } from '@/layouts/dashboard/header';
import { Asset, CurrencyList } from '@/modules/core';

interface AssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: (Asset & { balance: BN | null })[];
  isLoading?: boolean;
  onSelect: (asset: string) => void;
}

export const AssetsModal = ({
  isOpen,
  onClose,
  assets,
  isLoading = false,
  onSelect,
}: AssetsModalProps) => {
  const [search, setSearch] = useState('');

  const handleSelect = useCallback(
    (assetId: string) => {
      onSelect(assetId);
      onClose();
      setSearch('');
    },
    [onSelect, onClose, setSearch],
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
      isOpen={isOpen}
      onClose={onClose}
    >
      <Box display={{ base: 'block', xs: 'none' }} w="full">
        <Header />
      </Box>
      <Dialog.Header
        mt={3}
        mb={3}
        px={4}
        title="Select Asset"
        onClose={onClose}
      />
      <Dialog.Body py={{ base: 0, xs: 2 }}>
        <Stack spacing={4}>
          <FormControl px={4}>
            <InputGroup position="relative">
              <InputRightElement
                position="absolute"
                right={4}
                top="50%"
                transform="translateY(-50%)"
              >
                <Icon as={SearchIcon} color="grey.500" />
              </InputRightElement>
              <Input
                bg="dark.950"
                onChange={(e) => debouncedSearch(e)}
                placeholder=" "
              />
              <FormLabel>Search asset</FormLabel>
            </InputGroup>
          </FormControl>

          <Divider borderColor="grey.500" />

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
                <Stack spacing={0}>
                  <Text fontSize="md">{asset.slug}</Text>
                  <Text fontSize="xs"> {asset.name}</Text>
                </Stack>

                {asset.balance && (
                  <Text ml="auto" fontSize="xs" color="grey.500">
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
