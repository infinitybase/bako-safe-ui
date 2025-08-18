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
import { memo, useEffect, useMemo, useRef } from 'react';

import { CurrencyField } from '@/components';
import { Asset, SelectedCurrency } from '@/modules';
import { CRYPTO_CONFIG, formatCurrencyValue } from '@/utils';
import { moneyFormat } from '@/utils/money-format';

import { AssetsModal } from './AssetsModal';

interface CoinBoxProps {
  mode: 'buy' | 'sell';
  coin: Asset;
  onChangeAsset: (asset: string) => void;
  assets: (Asset & { balance: BN | null })[];
  onChangeAmount: (value: string) => void;
  isLoadingAmount?: boolean;
}

export const CoinBox = memo(
  ({
    mode,
    coin,
    onChangeAsset,
    assets,
    onChangeAmount,
    isLoadingAmount,
  }: CoinBoxProps) => {
    const assetsModal = useDisclosure();
    const mirrorRef = useRef<HTMLDivElement>(null);
    const coinInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (mirrorRef.current && coinInputRef.current) {
        const mirrorWidth = mirrorRef.current.offsetWidth;
        // eslint-disable-next-line react-compiler/react-compiler
        coinInputRef.current.style.width = `${mirrorWidth}px`;
      }
    }, [coin.amount]);

    const amountInUSD = useMemo(() => {
      if (!coin.amount || !coin.rate) return '0';
      const amount = bn.parseUnits(coin.amount, coin.units);
      const rate = bn.parseUnits(coin.rate.toString(), coin.units);
      return amount.mul(rate).formatUnits(coin.units * 2);
    }, [coin.amount, coin.rate, coin.units]);

    const value = useMemo(() => coin.amount || '', [coin.amount]);
    console.log('VALUE', { mode, value });

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
            gap={2}
          >
            <CurrencyField
              name={`amount-${mode}`}
              borderBottomWidth="0"
              ref={coinInputRef}
              value={value}
              type="crypto"
              px={0}
              placeholder="0"
              _placeholder={{ opacity: 0.5 }}
              isDisabled={isLoadingAmount}
              fontSize="3xl"
              onChange={onChangeAmount}
            />
            <Box
              position="absolute"
              visibility="hidden"
              fontSize="3xl"
              ref={mirrorRef}
            >
              {formatCurrencyValue(value || '0', CRYPTO_CONFIG, false)}
            </Box>
            <InputRightAddon
              onClick={() => {
                coinInputRef.current?.focus();
              }}
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

          {coin.amount && coin.rate && bn.parseUnits(coin.amount).gt(0) && (
            <Text color="grey.500" fontSize="xs">
              {moneyFormat(amountInUSD)}
            </Text>
          )}
        </Stack>
      </Card>
    );
  },
);

CoinBox.displayName = 'CoinBox';
