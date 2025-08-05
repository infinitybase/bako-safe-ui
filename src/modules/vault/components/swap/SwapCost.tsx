import { Card, Flex, Spinner, Stack, Text } from '@chakra-ui/react';
import { TransactionCost } from 'fuels';
import { PoolId } from 'mira-dex-ts';
import { memo } from 'react';

import { useSwapRate } from '../../hooks/swap/useSwapRate';
import { SwapState } from './Root';
import { SwapRouteItem } from './SwapRouteItem';

interface SwapCostProps {
  txCost?: TransactionCost;
  isLoadingCost: boolean;
  swapState: SwapState;
  pools: PoolId[];
}

export const SwapCost = memo(function SwapCost({
  txCost,
  isLoadingCost,
  swapState,
  pools,
}: SwapCostProps) {
  const rate = useSwapRate({ swapState });

  return (
    <Card variant="outline" p={3} mt={1}>
      <Stack spacing={1}>
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="section.500" fontSize="xs">
            Rate:
          </Text>
          <Text color="grey.75" fontSize="xs">
            {rate}
          </Text>
        </Flex>

        <Flex alignItems="center" justifyContent="space-between">
          <Text color="section.500" fontSize="xs">
            Routing:
          </Text>
          <Flex alignItems="center" gap={1}>
            {isLoadingCost && (
              <Spinner size="xs" ml="auto" color="section.500" />
            )}
            {!isLoadingCost &&
              pools.map((pool, i) => (
                <Flex alignItems="center" gap={0} key={String(pool) + i}>
                  <SwapRouteItem pool={pool} />
                  {i !== pools.length - 1 && (
                    <Text as="span" fontSize="xs" color="grey.75">
                      +
                    </Text>
                  )}
                </Flex>
              ))}
          </Flex>
        </Flex>

        <Flex alignItems="center" justifyContent="space-between">
          <Text color="section.500" fontSize="xs">
            Estimated fees:
          </Text>
          <Text color="grey.75" fontSize="xs">
            {isLoadingCost && (
              <Spinner size="xs" ml="auto" color="section.500" />
            )}
            {!isLoadingCost && swapState.fee?.formatUnits(9)}{' '}
            {!isLoadingCost && swapState.to.slug}
          </Text>
        </Flex>

        <Flex alignItems="center" justifyContent="space-between">
          {isLoadingCost && <Spinner size="xs" ml="auto" color="section.500" />}

          {!isLoadingCost && txCost?.gasPrice && (
            <>
              <Text color="section.500" fontSize="xs">
                Gas cost:
              </Text>
              <Text color="grey.75" fontSize="xs">
                {txCost?.gasPrice.formatUnits(9)} {'ETH'}
              </Text>
            </>
          )}
        </Flex>
      </Stack>
    </Card>
  );
});
