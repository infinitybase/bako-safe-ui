import {
  Box,
  Card,
  Flex,
  InputGroup,
  InputRightAddon,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { BN, bn } from 'fuels';
import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { CurrencyField } from '@/components';
import { Asset, SelectedCurrency } from '@/modules';
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

    return (
      <Card variant="outline" p={3} pb={12}>
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
            onClose={assetsModal.onClose}
            assets={assets}
            onSelect={onChangeAsset}
          />
        </Flex>

        <Stack justifyContent="center" alignItems="center" w="full">
          <InputGroup
            w="fit-content"
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
          >
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
              isDisabled={isLoadingAmount || isLoadingPreview}
              fontSize="3xl"
              decimalScale={coin.units}
              w={inputWidth ? `${inputWidth}px` : undefined}
              minW={'10px'}
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
            <InputRightAddon
              as="label"
              htmlFor={`amount-${mode}`}
              px={0}
              alignSelf="end"
            >
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
            </InputRightAddon>
          </InputGroup>

          <Text color="grey.500" fontSize="xs" minH="20px" maxW={'450px'}>
            {coin.amount &&
              currentRate &&
              bn.parseUnits(coin.amount).gt(0) &&
              moneyFormat(amountInUSD)}
          </Text>
        </Stack>
      </Card>
    );
  },
);

CoinBox.displayName = 'CoinBox';
