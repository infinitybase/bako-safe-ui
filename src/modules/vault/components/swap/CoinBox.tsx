import {
  Box,
  Button,
  Card,
  Flex,
  InputGroup,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { BN, bn } from 'fuels';
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { CurrencyField } from '@/components';
import { ETH_SLUG, MinEthValue } from '@/config/swap';
import { Asset, SelectedCurrency } from '@/modules';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { CRYPTO_CONFIG, formatCurrencyValue, formatMaxDecimals } from '@/utils';
import { moneyFormat } from '@/utils/money-format';

import { AssetsModal } from './AssetsModal';

interface CoinBoxProps {
  mode: 'buy' | 'sell';
  coin: Asset;
  onChangeAsset: (asset: string) => void;
  assets: (Asset & { balance: BN | null })[];
  onChangeAmount: (value: string) => void;
  isLoadingAmount?: boolean;
  isLoadingAssets?: boolean;
  isLoadingPreview: boolean;
}

export const CoinBox = memo(
  ({
    mode,
    coin,
    onChangeAsset,
    assets,
    onChangeAmount,
    isLoadingAmount,
    isLoadingAssets,
    isLoadingPreview,
  }: CoinBoxProps) => {
    const assetsModal = useDisclosure();
    const mirrorRef = useRef<HTMLDivElement>(null);
    const coinInputRef = useRef<HTMLInputElement>(null);
    const [inputWidth, setInputWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
      if (mirrorRef.current && coinInputRef.current) {
        const mirrorWidth = mirrorRef.current.offsetWidth;
        // eslint-disable-next-line react-compiler/react-compiler
        coinInputRef.current.style.width = `${mirrorWidth}px`;
      }
    }, [coin.amount]);

    const currentRate = useMemo(
      () => assets.find((a) => a.assetId === coin.assetId)?.rate || 0,
      [assets, coin.assetId],
    );

    const balance = useMemo(() => {
      const asset = assets.find((a) => a.assetId === coin.assetId);
      if (!asset?.balance) return '0';

      return asset.balance.formatUnits(asset.units);
    }, [assets, coin.assetId]);

    const amountInUSD = useMemo(() => {
      if (!coin.amount || !currentRate) return '0';
      const coinAmount = formatMaxDecimals(coin.amount, coin.units);

      const amount = bn.parseUnits(coinAmount, coin.units);

      const currentRateFormatted = formatMaxDecimals(
        currentRate.toString(),
        coin.units,
      );
      const rate = bn.parseUnits(currentRateFormatted, coin.units);
      return amount.mul(rate).formatUnits(coin.units * 2);
    }, [coin.amount, currentRate, coin.units]);

    const value = useMemo(
      () => (coin.amount === '0' ? '' : coin.amount || ''),
      [coin.amount],
    );

    useLayoutEffect(() => {
      if (!mirrorRef.current) return;
      const w = mirrorRef.current.offsetWidth;
      setInputWidth(w);
    }, [value, coin.units]);

    const config = useMemo(() => {
      return {
        ...CRYPTO_CONFIG,
        decimalScale:
          coin.units != null ? Number(coin.units) : CRYPTO_CONFIG.decimalScale,
      };
    }, [coin.units]);

    const handleChangeMaxBalance = useCallback(() => {
      const balanceInBN = bn.parseUnits(balance, coin.units);
      // subtract MinEthValue to avoid insufficient funds for gas when selling ETH
      const gasBuffer = bn.parseUnits(MinEthValue.toString(), coin.units);
      const amount =
        coin.slug === ETH_SLUG ? balanceInBN.sub(gasBuffer) : balanceInBN;
      onChangeAmount(amount.formatUnits(coin.units));
    }, [balance, coin, onChangeAmount]);

    return (
      <Card.Root variant="outline" p={3} pb={12}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" gap={2}>
            <Text color="section.500" fontSize="xs">
              {mode === 'buy' ? 'Buy' : 'Sell'}
            </Text>
            {isLoadingAmount && <Spinner color="grey.500" size="xs" />}
          </Flex>
          <Box>
            <SelectedCurrency
              name={coin.name}
              imageUrl={coin.icon}
              onClick={assetsModal.onOpen}
              isLoadingCurrencies={isLoadingAssets}
              balance={balance}
              symbol={coin.slug}
            />
          </Box>

          <AssetsModal
            isOpen={assetsModal.isOpen}
            onOpenChange={assetsModal.onOpenChange}
            assets={assets}
            onSelect={onChangeAsset}
          />
        </Flex>

        <Stack justifyContent="center" alignItems="center" w="full">
          <InputGroup
            w="fit-content"
            maxW={{
              base: '100%',
              sm: 'none',
            }}
            borderBottom="1px solid"
            borderColor="grey.950"
            _focusWithin={{
              borderColor: 'grey.200',
            }}
            opacity={isLoadingAmount ? 0.5 : 1}
            _hover={{
              borderColor: 'grey.200',
            }}
            onClick={() => {
              coinInputRef.current?.focus();
            }}
            gap={2}
            endElement={
              <Text
                color="grey.500"
                _groupFocusWithin={{
                  color: 'grey.200',
                }}
                _groupHover={{
                  color: 'grey.200',
                }}
                fontSize="sm"
              >
                {coin.slug}
              </Text>
            }
          >
            <>
              <CurrencyField
                name={`amount-${mode}`}
                id={`amount-${mode}`}
                borderBottomWidth="0"
                ref={coinInputRef}
                value={value}
                type="crypto"
                px={0}
                placeholder="0"
                _placeholder={{ opacity: 0.5 }}
                _focus={{ _placeholder: { color: 'grey.50' } }}
                disabled={isLoadingAmount || isLoadingPreview}
                fontSize="3xl"
                decimalScale={coin.units}
                w={inputWidth ? `${inputWidth}px` : undefined}
                minW={'20px'}
                maxW="450px"
                onChange={onChangeAmount}
              />
              <Box
                position="absolute"
                visibility="hidden"
                fontSize="3xl"
                ref={mirrorRef}
                whiteSpace="nowrap"
              >
                {formatCurrencyValue(value || '0', config, false)}
              </Box>
            </>
          </InputGroup>

          <Text color="grey.500" fontSize="xs" minH="20px" maxW={'450px'}>
            {coin.amount &&
              currentRate &&
              bn.parseUnits(coin.amount).gt(0) &&
              moneyFormat(amountInUSD)}
          </Text>

          {mode === 'sell' && (
            <Button
              colorPalette="secondary"
              size="xs"
              fontSize="2xs"
              onClick={handleChangeMaxBalance}
              disabled={isLoadingAmount}
              color="grey.425"
              borderRadius={6}
            >
              MAX
            </Button>
          )}
        </Stack>
      </Card.Root>
    );
  },
);

CoinBox.displayName = 'CoinBox';
