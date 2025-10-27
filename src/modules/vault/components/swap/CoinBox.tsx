import {
  Button,
  Card,
  createListCollection,
  Flex,
  Heading,
  InputGroup,
  Loader,
  Select,
  Stack,
  Text,
} from 'bako-ui';
import { motion } from 'framer-motion';
import { BN, bn } from 'fuels';
import { memo, useCallback, useMemo, useRef } from 'react';

import { CurrencyField } from '@/components';
import { ETH_SLUG, MinEthValue } from '@/config/swap';
import { Asset } from '@/modules';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';

import { calculateTextWidth } from '../../utils';
import { ExpandableCardSection } from '../bridge/ExpandableCardSection';
import { AssetsModal } from './AssetsModal';
import { SelectedAsset } from './SelectedAsset';

const Root = motion(Card.Root);

interface CoinBoxProps {
  mode: 'buy' | 'sell';
  coin: Asset;
  onChangeAsset: (asset: string) => void;
  assets: (Asset & { balance: BN | null })[];
  onChangeAmount: (value: string) => void;
  isLoadingAmount?: boolean;
  isLoadingAssets?: boolean;
  isLoadingPreview: boolean;
  isCurrentStep: boolean;
  onContinue: () => void;
  error?: string;
}

export const CoinBox = memo(
  ({
    mode,
    coin,
    onChangeAsset,
    assets,
    onChangeAmount,
    isLoadingAmount,
    isLoadingAssets = false,
    isLoadingPreview,
    isCurrentStep,
    onContinue,
    error,
  }: CoinBoxProps) => {
    const assetsModal = useDisclosure();
    const coinInputRef = useRef<HTMLInputElement>(null);

    const balance = useMemo(() => {
      const asset = assets.find((a) => a.assetId === coin.assetId);
      if (!asset?.balance) return '0';

      return asset.balance.formatUnits(asset.units);
    }, [assets, coin.assetId]);

    const value = useMemo(() => coin.amount || '', [coin.amount]);

    const width = useMemo(() => {
      return calculateTextWidth(value);
    }, [value]);

    const handleChangeMaxBalance = useCallback(() => {
      const balanceInBN = bn.parseUnits(balance, coin.units);
      if (balanceInBN.isZero()) {
        return onChangeAmount('');
      }
      // subtract MinEthValue to avoid insufficient funds for gas when selling ETH
      const gasBuffer = bn.parseUnits(MinEthValue.toString(), coin.units);
      const amount =
        coin.slug === ETH_SLUG ? balanceInBN.sub(gasBuffer) : balanceInBN;
      onChangeAmount(amount.formatUnits(coin.units));
    }, [balance, coin, onChangeAmount]);

    const assetsCollections = useMemo(
      () =>
        createListCollection({
          items: assets.map((asset) => ({
            label: asset.name || asset.slug,
            value: asset.assetId,
            balance: asset.balance,
            icon: asset.icon,
            units: asset.units,
          })),
        }),
      [assets],
    );

    return (
      <Root
        variant="subtle"
        rounded="2xl"
        w="full"
        bg="bg.panel"
        minH="88px"
        overflow="hidden"
      >
        <Card.Header pb={isCurrentStep ? 0 : 6}>
          <Flex alignItems="center" justifyContent="space-between" gap={1}>
            <Stack gap={1}>
              <Heading
                color={isCurrentStep ? 'textPrimary' : 'gray.400'}
                fontSize="sm"
                lineHeight="shorter"
              >
                {mode === 'buy' ? 'Receive' : 'Send'}
              </Heading>
              {!isCurrentStep && value && (
                <Text
                  truncate
                  lineClamp={1}
                  fontSize="sm"
                  color="gray.50"
                  letterSpacing="wider"
                  fontWeight="bold"
                  maxW={{ base: '130px', sm: 'unset' }}
                >
                  {value}
                  <Text as="span" ml={1} color="gray.400" fontWeight="normal">
                    {coin.slug}
                  </Text>
                </Text>
              )}
            </Stack>

            <Select.Root
              collection={assetsCollections}
              open={false}
              maxW="172px"
              rounded="lg"
              bg="bg.muted"
              cursor="pointer"
              value={[coin.assetId]}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger asChild>
                  <SelectedAsset
                    onClick={assetsModal.onOpen}
                    isLoading={isLoadingAssets}
                    balance={balance}
                  />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
            </Select.Root>
            <AssetsModal
              isOpen={assetsModal.isOpen}
              onOpenChange={assetsModal.onOpenChange}
              assets={assets}
              onSelect={onChangeAsset}
              isLoading={isLoadingAssets}
            />
          </Flex>
        </Card.Header>
        <ExpandableCardSection isExpanded={isCurrentStep} type="body">
          <Stack>
            <InputGroup
              alignItems="center"
              justifyContent="start"
              px={0}
              w={`${width}px`}
              maxW={{ base: 'fit-content', sm: 'unset' }}
              border="none"
              transition="width 0.15s ease-out"
              opacity={isLoadingAmount ? 0.5 : 1}
              onClick={() => {
                coinInputRef.current?.focus();
              }}
              gap={2}
              endElementProps={{
                px: 0,
                maxW: '50px',
              }}
              endElement={
                isLoadingAmount ? (
                  <Loader />
                ) : (
                  <Text color="gray.400" fontSize="sm" truncate lineClamp={1}>
                    {coin.slug}
                  </Text>
                )
              }
            >
              <CurrencyField
                bg="bg.panel"
                outline="none"
                border="none"
                color="gray.50"
                _selection={{
                  bg: 'textSecondary',
                }}
                name={`amount-${mode}`}
                ref={coinInputRef}
                value={value}
                type="crypto"
                letterSpacing="wider"
                minW={0}
                px={0}
                placeholder="0.000"
                disabled={isLoadingAmount || isLoadingPreview}
                fontSize="3xl"
                decimalScale={coin.units}
                onChange={onChangeAmount}
                fontWeight="bold"
              />
            </InputGroup>
          </Stack>
        </ExpandableCardSection>
        <ExpandableCardSection isExpanded={isCurrentStep} type="footer">
          <Flex alignItems="center" justifyContent="space-between" w="full">
            {mode === 'sell' && (
              <Button
                variant="subtle"
                onClick={handleChangeMaxBalance}
                disabled={isLoadingAmount || isLoadingAssets}
                borderRadius="lg"
                size="xs"
              >
                MAX
              </Button>
            )}
            {error ? (
              <Text
                fontSize="xs"
                color="red.500"
                lineClamp={1}
                truncate
                ml="auto"
              >
                {error}
              </Text>
            ) : (
              <Button
                size="xs"
                rounded="lg"
                disabled={isLoadingAssets}
                loading={isLoadingAmount}
                ml="auto"
                onClick={onContinue}
              >
                Continue
              </Button>
            )}
          </Flex>
        </ExpandableCardSection>
      </Root>
    );
  },
);

CoinBox.displayName = 'CoinBox';
