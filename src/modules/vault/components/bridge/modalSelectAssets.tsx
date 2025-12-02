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
import { useCallback, useMemo, useState } from 'react';
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
  options?: Array<AssetItem & { id: string }>;
  onOpenChange?: (open: DialogOpenChangeDetails) => void;
  onSelect: (asset: AssetItem) => void;
}

const AssetItem = ({ asset, onSelect }: AssetItemBrigdeProps) => {
  const [loaded, setLoaded] = useState(false);
  const { image, name, symbol, balance } = asset;

  return (
    <HStack
      border="1px solid"
      borderColor="bg.muted"
      padding={4}
      borderRadius={8}
      cursor="pointer"
      _hover={{ bgColor: 'bg.muted/90' }}
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
      <Text fontSize="sm" fontWeight={500} color="gray.50">
        {name}
      </Text>
      <Text ml="auto" fontSize="sm" fontWeight={400} color="gray.50">
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
  const [assetSelected, setAssetSelected] = useState<AssetItem>(
    {} as AssetItem,
  );
  const [searchValue, setSearchValue] = useState('');

  const handleClose = () => {
    if (assetSelected?.value) {
      onSelect(assetSelected);
    } else {
      form.resetField('selectAssetTo');
    }

    form.resetField('searchAsset');
    // setSearchValue('');
    onOpenChange?.({ open: false });
  };

  const filteredOptions = useMemo(() => {
    const filtered =
      options?.filter(
        (option) =>
          option.symbol
            ?.toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase()) ||
          option.name
            .toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase()),
      ) || [];

    // Deduplicate by value to prevent duplicates
    const seen = new Set<string>();
    return filtered.filter((option) => {
      if (seen.has(option.id)) {
        return false;
      }
      seen.add(option.id);
      return true;
    });
  }, [options, searchValue]);

  const sortedOptions = useMemo(() => {
    return [...filteredOptions].sort((a, b) => {
      const usdA = tokensUSD.data[a.value.toLowerCase()]?.usdAmount;
      const usdB = tokensUSD.data[b.value.toLowerCase()]?.usdAmount;

      if (usdA != null && usdB != null) {
        return usdB - usdA;
      }

      if (usdA != null) return -1;
      if (usdB != null) return 1;

      return Number(b.balance) - Number(a.balance);
    });
  }, [filteredOptions, tokensUSD.data]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleSelectAsset = useCallback(
    (asset: AssetItem) => {
      onSelect(asset);
      setAssetSelected(asset);
      getOperationLimits(asset);
      form.resetField('searchAsset');
      onOpenChange?.({ open: false });
    },
    [form, onSelect, onOpenChange, getOperationLimits],
  );

  return (
    <Dialog.Modal
      open={isOpen}
      onOpenChange={handleClose}
      closeOnInteractOutside={false}
      size={{ base: 'full', sm: 'sm' }}
    >
      <Dialog.Body minH={650} maxH={650} flex={1} overflow="hidden">
        <Dialog.Header
          position={{ base: 'static', sm: 'relative' }}
          title={title}
          description={`Select the asset of your choice.`}
          mb={0}
          mt={0}
          px={6}
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
              <Field.Root invalid={fieldState.invalid} marginY={6} px={6}>
                <InputGroup endElement={<SearchIcon color="textPrimary" />}>
                  <Input
                    placeholder="Search asset"
                    bgColor="dark.950"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      handleSearch(e.target.value);
                    }}
                  />
                </InputGroup>
              </Field.Root>
            );
          }}
        />
        <Separator marginTop={6} borderColor="bg.muted" />
        <VStack
          maxH={523}
          overflowY="auto"
          p={6}
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
          {sortedOptions.length > 0 ? (
            sortedOptions.map((asset) => (
              <AssetItem
                key={asset.id}
                asset={asset}
                onSelect={handleSelectAsset}
              />
            ))
          ) : (
            <Text fontSize="sm">No assets found</Text>
          )}
        </VStack>
      </Dialog.Body>
    </Dialog.Modal>
  );
}
