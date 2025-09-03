import { CloseIcon } from '@chakra-ui/icons';
import {
  Badge,
  CircularProgress,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  List,
  ListItem,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';

import { Dialog } from '@/components';
import UnknownAsset from '/tokens/unknown.svg';

import { useAssetsBalance } from '../hooks/useAssetsBalance';
import { useListAssets } from '../hooks/useListAssets';
import type { Asset } from '../types';
import { FUEL_ASSET_ID, FUEL_ASSET_ID_TESTNNET } from '../utils/constants';
import { removeRightZeros } from '../utils/remove-right-zeros';

interface AssetSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: { id: string; name?: string; icon?: string }) => void;
  userWithHandle: boolean;
}

export const AssetSearchModal = ({
  isOpen,
  onClose,
  onSelect,
  userWithHandle,
}: AssetSearchModalProps) => {
  const [search, setSearch] = useState('');
  const { assets, isLoading: isAssetsLoading } = useListAssets();

  const { data, isLoading: isBalancesLoading } = useAssetsBalance({ assets });

  const isLoading = isAssetsLoading || isBalancesLoading;

  const filteredAssets = useMemo(() => {
    return (
      data?.filter((asset) => {
        const name = asset.metadata?.name?.toLowerCase() ?? '';
        const symbol = asset.metadata?.symbol?.toLowerCase() ?? '';
        const searchLower = search.toLowerCase();

        return (
          name.includes(searchLower) ||
          symbol.includes(searchLower) ||
          asset.id.toLowerCase().includes(searchLower)
        );
      }) ?? []
    );
  }, [data, search]);

  const isEmpty = useMemo(() => filteredAssets.length === 0, [filteredAssets]);

  const handleSelect = (asset: {
    id: string;
    name?: string;
    icon?: string;
    decimals?: number;
  }) => {
    onSelect(asset);
    onClose();
  };

  const getFeePercentage = useCallback(
    (asset: Asset) => {
      const fee = userWithHandle ? asset.fees?.[1] : asset.fees?.[0];
      if (!fee) return '0';
      return removeRightZeros((Number(fee) / 100).toFixed(2));
    },
    [userWithHandle],
  );

  return (
    <Dialog.Modal
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Assets"
      modalSubtitle="Select the asset of your choice"
    >
      <Stack gap={6} w="full">
        <FormControl position="relative">
          <CloseIcon
            position="absolute"
            right={3}
            top="50%"
            transform="translateY(-50%)"
            fontSize="sm"
            zIndex={99}
          />
          <Input
            size="lg"
            placeholder=" "
            bg="dark.950"
            borderColor="grey.925"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <FormLabel fontSize="sm">Search asset</FormLabel>
        </FormControl>

        <Divider />

        <List spacing={2}>
          {!isLoading &&
            filteredAssets.map((asset) => (
              <ListItem
                key={asset.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={3}
                borderWidth={1}
                bg="dark.950"
                borderRadius="lg"
                borderStyle="solid"
                borderColor="grey.925"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  borderColor: 'section.200',
                }}
                onClick={() =>
                  handleSelect({
                    id: asset.id,
                    name:
                      asset.metadata?.name ??
                      asset.metadata?.symbol ??
                      'Unknown Asset',
                    icon: asset.metadata?.icon ?? UnknownAsset,
                    decimals: asset.metadata?.decimals,
                  })
                }
              >
                <Flex alignItems="center" gap={2}>
                  <Image
                    src={asset.metadata?.icon ?? UnknownAsset}
                    alt={asset.metadata?.name ?? 'Unknown Asset'}
                    boxSize="24px"
                    borderRadius="full"
                  />
                  <Text>{asset.metadata?.name}</Text>
                  {(asset.id === FUEL_ASSET_ID ||
                    asset.id === FUEL_ASSET_ID_TESTNNET) && (
                    <Badge
                      variant="outline"
                      shadow="none"
                      borderColor="brand.500"
                      py={1}
                      px={2}
                      color="brand.500"
                      title={`${userWithHandle ? asset.fees?.[1] : asset.fees?.[0]} Fee`}
                    >
                      {getFeePercentage(asset)}% Fee
                    </Badge>
                  )}
                </Flex>

                <Stack spacing={1} direction="row" alignItems="center">
                  <Text>
                    {Number(
                      asset.balance?.formatUnits(asset.metadata?.decimals),
                    )}
                  </Text>
                  <Text textTransform="uppercase">
                    {asset.metadata?.symbol}
                  </Text>
                </Stack>
              </ListItem>
            ))}

          {!isLoading && isEmpty && (
            <ListItem>
              <Text>No assets found</Text>
            </ListItem>
          )}

          {isLoading && (
            <ListItem>
              <CircularProgress isIndeterminate size="24px" />
            </ListItem>
          )}
        </List>
      </Stack>
    </Dialog.Modal>
  );
};
