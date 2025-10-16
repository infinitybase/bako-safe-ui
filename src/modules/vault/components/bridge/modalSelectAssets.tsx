import {
  DialogOpenChangeDetails,
  Field,
  HStack,
  Image,
  Input,
  InputGroup,
  Separator,
  Skeleton,
  Text,
  VStack,
} from 'bako-ui';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Dialog, SearchIcon } from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

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
  onSelect: (asset: AssetItem) => void;
}

export interface ModalSelectAssetsProps {
  title: string;
  isOpen?: boolean;
  options?: AssetItem[];
  onOpenChange?: (open: DialogOpenChangeDetails) => void;
  onSelect: (asset: AssetItem) => void;
}

const AssetItem = ({ asset, onSelect }: AssetItemBrigdeProps) => {
  const [loaded, setLoaded] = useState(false);
  const { image, name, symbol, balance } = asset;

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
      <Text ml="auto" fontSize={12} fontWeight={400}>
        {balance} {symbol}
      </Text>
    </HStack>
  );
};

export function ModalSelectAssetsBridge({
  title,
  isOpen = false,
  options,
  onOpenChange,
  onSelect,
}: ModalSelectAssetsProps) {
  const { control } = useFormContext<ITransferBridgePayload>();
  const { tokensUSD } = useWorkspaceContext();
  const { form, getOperationLimits } = useFormBridge();
  const [filteredAssets, setFilteredAssets] = useState<AssetItem[]>([]);
  const [assetSelected, setAssetSelected] = useState<AssetItem>(
    {} as AssetItem,
  );
  const [searchValue, setSearchValue] = useState('');

  const handleClose = () => {
    setFilteredAssets(options ?? []);
    if (assetSelected?.value) {
      onSelect(assetSelected);
    } else {
      form.resetField('selectAssetTo');
    }

    form.resetField('searchAsset');
    setSearchValue('');
    onOpenChange?.({ open: false });
  };

  const orderOptions = useCallback(
    (optionsOrder: AssetItem[]) => {
      return optionsOrder?.sort((a, b) => {
        const usdA = tokensUSD.data[a.value.toLowerCase()]?.usdAmount;
        const usdB = tokensUSD.data[b.value.toLowerCase()]?.usdAmount;

        if (usdA != null && usdB != null) {
          return usdB - usdA;
        }

        if (usdA != null) return -1;
        if (usdB != null) return 1;

        return Number(b.balance) - Number(a.balance);
      });
    },
    [tokensUSD.data],
  );

  useEffect(() => {
    if (!options) return;

    let result = options;

    if (searchValue.trim()) {
      result = options.filter((asset) =>
        asset.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }

    setFilteredAssets(orderOptions(result));
  }, [options, orderOptions, searchValue]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleSelectAsset = useCallback(
    (asset: AssetItem) => {
      onSelect(asset);
      setAssetSelected(asset);
      getOperationLimits(asset);
      onOpenChange?.({ open: false });
    },
    [onSelect, onOpenChange, getOperationLimits],
  );

  return (
    <Dialog.Modal
      open={isOpen}
      onOpenChange={handleClose}
      closeOnInteractOutside={false}
      size={'md'}
    >
      <Dialog.Body minH={650} maxH={650} flex={1}>
        <Dialog.Header
          position={{ base: 'static', sm: 'relative' }}
          title={title}
          description={`Select the asset of your choice.`}
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
          name="searchAsset"
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
                </InputGroup>
                <Field.Label>Search asset</Field.Label>
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
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              /* eslint-disable react/prop-types */
              <AssetItem
                key={asset.value}
                asset={asset}
                onSelect={handleSelectAsset}
              />
            ))
          ) : (
            <Text color="grey.50" fontSize={12}>
              No assets found
            </Text>
          )}
        </VStack>
      </Dialog.Body>
    </Dialog.Modal>
  );
}
