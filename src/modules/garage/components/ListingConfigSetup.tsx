import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { isNaN as lodashIsNaN } from 'lodash';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Card } from '@/components';

import type { Asset } from '../types';
import { FUEL_ASSET_ID } from '../utils/constants';
import { AssetSearchModal } from './AssetSearchModal';
import { CurrencyInput } from './CurrencyInput';
import SummaryFeeCard from './SummaryFeeCard';

export type ListingConfigFormProps = {
  sellAsset: {
    name: string;
    id: string;
    icon?: string;
    decimals?: number;
  };
  sellPrice: number;
};

interface ListingConfigSetupProps {
  initialValues?: ListingConfigFormProps;
  onSubmit: (
    data: ListingConfigFormProps & { currentReceiveAmountInUsd: number },
  ) => void;
  assets: Asset[];
  userWithHandle: boolean;
}

export const ListingConfigSetup = ({
  initialValues,
  onSubmit,
  assets,
  userWithHandle,
}: ListingConfigSetupProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<ListingConfigFormProps>({
    defaultValues: initialValues,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const sellAssetId = watch('sellAsset.id');

  const currentSellAsset = useMemo(
    () => assets.find((asset) => asset.id === sellAssetId),
    [assets, sellAssetId],
  );

  const findDefaultAsset = useMemo(
    () =>
      assets.find(
        (asset) =>
          asset.id === FUEL_ASSET_ID || asset.metadata?.symbol === 'FUEL',
      ),
    [assets],
  );
  const defaultAsset = {
    id: findDefaultAsset?.id,
    name: findDefaultAsset?.metadata?.name,
    icon: findDefaultAsset?.metadata?.icon,
    decimals: findDefaultAsset?.metadata?.decimals,
  };

  const handleClearAmount = () => {
    setValue('sellPrice', 0);
  };

  const userWithHandleFee = useMemo(() => {
    if (!currentSellAsset) return '0';
    return currentSellAsset.fees[1];
  }, [currentSellAsset]);

  const userWithoutHandleFee = useMemo(() => {
    if (!currentSellAsset) return '0';
    return currentSellAsset.fees[0];
  }, [currentSellAsset]);

  const currentFee = useMemo(() => {
    if (!currentSellAsset) return '0';
    return userWithHandle
      ? userWithHandleFee // User with handle pays the second fee
      : userWithoutHandleFee; // User without handle pays the first fee
  }, [
    currentSellAsset,
    userWithHandle,
    userWithHandleFee,
    userWithoutHandleFee,
  ]);

  const currentValue = watch('sellPrice');

  const valueToReceive = useMemo(() => {
    if (!currentSellAsset || !currentValue) return '0';

    const valueInBaseUnits = bn.parseUnits(
      currentValue.toString(),
      currentSellAsset.metadata?.decimals || 9,
    );
    const feeAmount = valueInBaseUnits.mul(currentFee).div(10000);
    const valueAfterFee = valueInBaseUnits.sub(feeAmount);

    return valueAfterFee.formatUnits(currentSellAsset.metadata?.decimals || 9);
  }, [currentValue, currentSellAsset, currentFee]);

  const currentReceiveAmountInUsd = useMemo(() => {
    const valueToReceiveInNumber = Number(valueToReceive);
    if (!currentSellAsset || Number.isNaN(valueToReceiveInNumber)) return '-';
    const amount =
      (currentSellAsset?.metadata?.rate || 0) * valueToReceiveInNumber;
    return `~ ${amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })}`;
  }, [currentSellAsset, valueToReceive]);

  return (
    <Grid
      w="full"
      as="form"
      id="nft-sale-form"
      onSubmit={handleSubmit((data) =>
        onSubmit({
          ...data,
          currentReceiveAmountInUsd: Number(
            currentReceiveAmountInUsd.replace(/[^\d.]/g, '').trim(),
          ),
        }),
      )}
      templateColumns="repeat(2, 1fr)"
      gap={4}
    >
      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Controller
          control={control}
          name="sellAsset"
          defaultValue={defaultAsset as ListingConfigFormProps['sellAsset']}
          rules={{
            required: 'Asset is required',
          }}
          render={({ field }) => (
            <>
              <FormControl
                isInvalid={!!errors.sellAsset}
                position="relative"
                _focusWithin={{
                  label: 'none',
                }}
              >
                {field.value?.id && (
                  <Image
                    position="absolute"
                    left={3}
                    zIndex={99}
                    top="47%"
                    boxSize="18px"
                    src={field.value.icon}
                    alt={field.value.name}
                  />
                )}

                <Input
                  {...field}
                  readOnly
                  type="text"
                  bg="dark.950"
                  borderColor="grey.925"
                  onClick={onOpen}
                  value={field.value?.name}
                  onKeyUp={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.key === 'Enter') {
                      onOpen();
                    }
                  }}
                  placeholder=" "
                  pl={field.value?.id ? `${10} !important` : `${5} !important`}
                  fontSize="xs"
                  cursor="pointer"
                />
                <ChevronDownIcon
                  position="absolute"
                  right={2}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={99}
                />

                <FormLabel
                  fontSize="sm"
                  position="absolute"
                  top={field.value?.id ? 1 : '50%'}
                  transform={
                    field.value?.id
                      ? 'translateY(-10px) scale(0.7)'
                      : 'translateY(50%)'
                  }
                  transition="all 0.2s"
                  left={field.value?.id ? 3.5 : 5}
                  color="grey.400"
                  mb={1}
                  fontWeight="medium"
                  lineHeight="1"
                >
                  Asset
                </FormLabel>
                {errors.sellAsset && (
                  <FormErrorMessage fontSize="sm">
                    {errors.sellAsset.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <AssetSearchModal
                onClose={onClose}
                isOpen={isOpen}
                onSelect={field.onChange}
                userWithHandle={userWithHandle}
              />
            </>
          )}
        />
      </GridItem>
      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Controller
          control={control}
          name="sellPrice"
          defaultValue={undefined}
          rules={{
            required: 'Amount is required',
            validate: {
              positive: (value) => {
                if (value <= 0) {
                  return 'Amount must be greater than 0';
                }
                return true;
              },
              IsNotNaN: (value) => {
                if (lodashIsNaN(value)) {
                  return 'Amount must be a number';
                }
                return true;
              },
            },
          }}
          render={({ field }) => (
            <FormControl
              isInvalid={!!errors.sellPrice}
              _focusWithin={{
                label: 'none',
              }}
            >
              <CurrencyInput
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                bg="dark.950"
                borderColor="grey.925"
                placeholder=" "
                fontSize="xs"
                type="text"
                size="lg"
                isInvalid={!!errors.sellPrice}
              />

              <IconButton
                onClick={handleClearAmount}
                variant="unstyled"
                size="xs"
                aria-label="Clear"
                position="absolute"
                right={2}
                top="50%"
                transform="translateY(-50%)"
                zIndex={99}
              >
                <CloseIcon height={2} width={2} />
              </IconButton>

              <FormLabel
                fontSize="sm"
                position="absolute"
                top={field.value ? 1 : '50%'}
                transform={
                  field.value
                    ? 'translateY(-10px) scale(0.7)'
                    : 'translateY(50%)'
                }
                transition="all 0.2s"
                left={field.value ? 3.5 : 5}
                color="grey.400"
                mb={1}
                fontWeight="medium"
                lineHeight="1"
              >
                Amount
              </FormLabel>
              {errors.sellPrice && (
                <FormErrorMessage fontSize="xs" lineHeight=".1">
                  {errors.sellPrice.message}
                </FormErrorMessage>
              )}
            </FormControl>
          )}
        />
      </GridItem>

      <GridItem colSpan={2}>
        <SummaryFeeCard
          assetSymbol={currentSellAsset?.metadata?.symbol || 'FUEL'}
          currentFee={currentFee}
          currentValue={currentValue}
          currentReceiveAmountInUsd={currentReceiveAmountInUsd}
          valueToReceive={valueToReceive}
          isFuelToken={currentSellAsset?.id === FUEL_ASSET_ID}
        />
      </GridItem>

      {!userWithHandle && (
        <GridItem colSpan={2}>
          <Card
            p={4}
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
            display="flex"
          >
            <Stack spacing={2}>
              <Text
                fontSize="md"
                fontWeight="bold"
              >{`Unlock ${bn(userWithHandleFee).formatUnits(2)}% fee`}</Text>
              <Text fontSize="sm" color="section.200">
                Turn your address into a Handle <br /> and get{' '}
                <Text as="span" color="brand.500">
                  {`${bn(userWithHandleFee).formatUnits(2)}%`} trade fees
                </Text>
              </Text>
            </Stack>
            <Button variant="secondary" w="fit-content" fontSize="sm">
              Get now
            </Button>
          </Card>
        </GridItem>
      )}
    </Grid>
  );
};
