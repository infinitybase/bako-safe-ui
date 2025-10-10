import {
  Field,
  HStack,
  Image,
  Input,
  InputGroup,
  Separator,
  Skeleton,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Dialog, SearchIcon } from '@/components';

import { useFormBridge } from '../../hooks/bridge';
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
      borderColor="grey.950"
      padding={4}
      borderRadius={8}
      cursor="pointer"
      _hover={{ bgColor: 'grey.925' }}
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

      <Text fontSize={12} fontWeight={500} color="grey.50">
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
}: ModalSelectAssetsProps) {
  const { control } = useFormContext<ITransferBridgePayload>();
  const { form } = useFormBridge();

  const [filteredNetworks, setFilteredNetworks] = useState<AssetItem[]>([]);
  const [assetSelected, setAssetSelected] = useState<AssetItem>(
    {} as AssetItem,
  );

  const handleClose = () => {
    setFilteredNetworks(options ?? []);
    if (assetSelected?.value) {
      onSelect(assetSelected);
    } else {
      form.resetField('selectNetworkTo');
    }

    form.resetField('searchNetwork');
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
      onClose();
    },
    [onSelect, onClose],
  );

  return (
    <Dialog.Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      size={'md'}
    >
      <Dialog.Body minH={650} maxH={650} flex={1}>
        <Dialog.Header
          position={{ base: 'static', sm: 'relative' }}
          title={title}
          description={`Select the network of your choice.`}
          mb={0}
          mt={0}
          titleSxProps={{
            fontSize: 16,
            fontWeight: 700,
            color: 'grey.50',
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
              <Field.Root invalid={fieldState.invalid} marginY={4}>
                <InputGroup endElement={<SearchIcon color="grey.500" />}>
                  <Input
                    placeholder=""
                    bgColor="dark.950"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      handleSearch(e.target.value);
                    }}
                  />

                  <Field.Label>Search Network</Field.Label>
                </InputGroup>
              </Field.Root>
            );
          }}
        />
        <Separator marginTop={6} borderColor="grey.950" />
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
            <Spinner color="grey.500" size="md" />
          ) : filteredNetworks.length > 0 ? (
            filteredNetworks.map((net) => (
              /* eslint-disable react/prop-types */
              <AssetItem
                key={net.value}
                asset={net}
                onSelect={handleSelectAsset}
              />
            ))
          ) : (
            <Text color="grey.50" fontSize={12}>
              No netwoks found
            </Text>
          )}
        </VStack>
      </Dialog.Body>
    </Dialog.Modal>
  );
}
