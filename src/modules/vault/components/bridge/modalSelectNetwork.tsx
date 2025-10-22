import {
  DialogOpenChangeDetails,
  Field,
  floatingStyles,
  HStack,
  Image,
  Input,
  InputGroup,
  Loader,
  Separator,
  Skeleton,
  Text,
  VStack,
} from 'bako-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Dialog, SearchIcon } from '@/components';

import { ITransferBridgePayload } from './providers/FormBridgeProvider';

export interface AssetItem {
  value: string;
  image: string;
  name: string;
  symbol: string | null;
  balance?: string;
}

export interface AssetItemBrigdeProps {
  asset: AssetItem;
}

export interface ModalSelectAssetsProps {
  title: string;
  isOpen?: boolean;
  options?: AssetItem[];
  isLoadingOptions: boolean;
  onClose: () => void;
  onOpenChange?: (details: DialogOpenChangeDetails) => void;
  onSelect: (asset: AssetItem) => void;
}

const AssetItem = React.memo(function AssetItemMemo({
  asset,
  onSelect,
}: AssetItemBrigdeProps & { onSelect: (a: AssetItem) => void }) {
  const [loaded, setLoaded] = useState(false);
  const { image, name } = asset;

  return (
    <HStack
      border="1px solid"
      borderColor="bg.panel"
      padding={4}
      borderRadius={8}
      cursor="pointer"
      _hover={{ bgColor: 'bg.muted' }}
      w="100%"
      onClick={() => onSelect(asset)}
    >
      <Skeleton loading={!loaded} boxSize={6} borderRadius="full">
        <Image
          src={image}
          boxSize={6}
          borderRadius="full"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      </Skeleton>

      <Text fontSize="sm" fontWeight="normal" color="textPrimary">
        {name}
      </Text>
    </HStack>
  );
});

export function ModalSelectNetworkBridge({
  title,
  isOpen = false,
  options,
  isLoadingOptions,
  onClose,
  onSelect,
  onOpenChange,
}: ModalSelectAssetsProps) {
  const { control, resetField } = useFormContext<ITransferBridgePayload>();

  const [filteredNetworks, setFilteredNetworks] = useState<AssetItem[]>([]);
  const [assetSelected, setAssetSelected] = useState<AssetItem>(
    {} as AssetItem,
  );

  const handleClose = () => {
    setFilteredNetworks(options ?? []);
    if (assetSelected?.value) {
      onSelect(assetSelected);
    } else {
      resetField('selectNetworkTo');
    }

    resetField('searchNetwork');
    onClose();
  };

  useEffect(() => {
    setFilteredNetworks(options ?? []);
  }, [options]);

  const handleSearch = useCallback(
    (searchValue: string) => {
      if (!options) return;

      if (!searchValue.trim()) {
        setFilteredNetworks(options);
        return;
      }

      const filtered = options.filter((asset) =>
        asset.name.toLowerCase().includes(searchValue.toLowerCase()),
      );

      setFilteredNetworks(filtered);
    },
    [options, setFilteredNetworks],
  );

  const handleSelectAsset = useCallback(
    (asset: AssetItem) => {
      onSelect(asset);
      setAssetSelected(asset);
      setFilteredNetworks(options ?? []);
      resetField('searchNetwork');
      onClose();
    },
    [resetField, options, setFilteredNetworks, onSelect, onClose],
  );

  return (
    <Dialog.Modal
      open={isOpen}
      onOpenChange={onOpenChange}
      closeOnInteractOutside={false}
      size={{ base: 'full', sm: 'md' }}
    >
      <Dialog.Body minH={650} maxH={650} flex={1}>
        <Dialog.Header
          position={{ base: 'static', sm: 'relative' }}
          title={title}
          description={`Select the network of your choice.`}
          mb={0}
          mt={0}
          px={3}
          titleSxProps={{
            fontSize: 16,
            fontWeight: 700,
            color: 'gray.50',
            marginTop: { base: 5, md: 0 },
          }}
          descriptionFontSize="12px"
          onClose={handleClose}
        />
        <Controller
          name="searchNetwork"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field.Root invalid={fieldState.invalid} marginY={4} px={3}>
                <InputGroup endElement={<SearchIcon color="textPrimary" />}>
                  <Input
                    placeholder=" "
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      handleSearch(e.target.value);
                    }}
                  />
                </InputGroup>
                <Field.Label
                  css={floatingStyles({ hasValue: field.value.length > 0 })}
                >
                  Search Network
                </Field.Label>
              </Field.Root>
            );
          }}
        />
        <Separator marginTop={6} borderColor="bg.muted" />
        <VStack
          maxH={523}
          overflowY="auto"
          m={0}
          p={0}
          pt={6}
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
              width: '5px',
              maxHeight: '330px',
              backgroundColor: 'transparent',
              borderRadius: '30px',
            },
          }}
        >
          {isLoadingOptions ? (
            <Loader color="grey.500" size="md" />
          ) : filteredNetworks.length > 0 ? (
            filteredNetworks.map((net) => (
              <AssetItem
                key={net.value}
                asset={net}
                onSelect={handleSelectAsset}
              />
            ))
          ) : (
            <Text color="gray.50" fontSize="xs">
              No networks found
            </Text>
          )}
        </VStack>
      </Dialog.Body>
    </Dialog.Modal>
  );
}
